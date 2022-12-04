import { MongoClient } from "mongodb";
import emailValidator from "deep-email-validator";
import * as argon2 from "argon2";
import { passwordStrength } from 'check-password-strength';
import * as crypto from "crypto";
import jwt from 'jsonwebtoken';

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const database = client.db("itsecta");
const users = database.collection("user");

const hashingConfig = { // based on OWASP cheat sheet recommendations (as of March, 2022)
    parallelism: 1,
    memoryCost: 64000, // 64 mb
    timeCost: 3 // number of itetations
}

async function hashPassword(password) {
    let salt = crypto.randomBytes(16);
    return await argon2.hash(password, {
        ...hashingConfig,
        salt,
    })
}
 
async function verifyPasswordWithHash(password, hash) {
    return await argon2.verify(hash, password, hashingConfig);
}

export function generateAccessToken(email, id) {
    return jwt.sign({ userID: id, email: email }, process.env.TOKEN_SECRET, { expiresIn: '7200s' });
}

export async function authenticateAdminToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
      console.log(err);
  
      if (err) return res.sendStatus(403);
      if (!await isExistRegistration(user.email)) return res.sendStatus(401);
      if (!await isAdmin(user.userID)) return res.sendStatus(401);

      req.user = user;
  
      next();
    })
}

export async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
      console.log(err);
  
      if (err) return res.sendStatus(403);
      if (!await isExistRegistration(user.email)) return res.sendStatus(401);
  
      req.user = user;
  
      next();
    })
}

export async function isEmailValid(email) {
    return emailValidator.validate({
    email: email,
    validateRegex: true,
    validateMx: true,
    validateTypo: true,
    validateDisposable: true,
    validateSMTP: false,    // Several email providers refuse SMTP
  })
}
  
export async function isExistRegistration(email) {
   const result = await getUserByEmail(email);
    console.log(result);
    if(result) {
        console.log("van ilyen email");
        return true;
    }
    console.log("nincs ilyen email");
    return false;
}
  
export async function addUser(email, password) {
    let result;
    try {
      const hash = await hashPassword(password);
      const newuser = {
        email: email,
        password: hash,
        userID: crypto.randomUUID(), 
      }
       result = await users.insertOne(newuser);
      console.log(`A user was inserted with the _id: ${result.insertedId}`);
      return result;
    } finally {
      //console.log("Database could not open");
      //await client.close();
    }
}

export async function getUserByEmail(email) {
    const result = await users.findOne( { email: { $eq: email } });
    return result;
}

export async function isValidUser(email, password) {
    const user = await getUserByEmail(email);
    console.log(user);
    if(!user) return { code: 401, data: { message: 'Bad credential.'}};
    if(await verifyPasswordWithHash(password, user.password)) {
        if(user.admin) {
            return  { code: 200, data: { token: generateAccessToken(user.email, user.userID), admin: true }};
        }
        return  { code: 200, data: { token: generateAccessToken(user.email, user.userID) }};
    }
    return { code: 401, data: { message: 'Bad credential.'}};
}

export async function findUserByUserID(userID) {
    const result = await users.findOne({ userID: { $eq: userID }});
    return result;
}

export async function setUserData(body, userInfo) {
    let user;
    let token = null;
    let needToken; 
    console.log("setuserdata");
    console.log(body);
    if(body.userID){ 
        user = await findUserByUserID(body.userID);
        needToken = false;
    } else {
        user = userInfo;
        needToken = true;
    }
    console.log(user);
    if(!user) return { code: 401, message: 'Bad credentials.'};
    
    const filter = { userID: user.userID };
    if(body.newEmail && body.newPassword) {
        if(await passwordStrength(body.newPassword).value !== 'Strong') {
            return { code: 400, data: { message: 'Please provide a strong password.' }};
          }
          const { valid } = await isEmailValid(body.newEmail);

          if (!valid) return { code: 400, data: { message: 'Please provide a valid email address.' }};
    
          if(await isExistRegistration(body.newEmail)) return { code: 400, data: { message: 'Email address already exist.'}};
          try{
            const hash = await hashPassword(body.newPassword);
            const updateDocument = { $set: { email: body.newEmail, password: hash } };
            await users.updateOne(filter, updateDocument);
            if(needToken) token = generateAccessToken(body.newEmail, userInfo.userID);
          } catch(error){
            return { code: 500, data: { message: 'Internal server error.' }};
        }  
    } else if(body.newPassword) {
        if(await passwordStrength(body.newPassword).value !== 'Strong') {
          return { code: 400, data: { message: 'Please provide a strong password.' }};
        }
        try {
            const hash = await hashPassword(body.newPassword);
            const updateDocument = { $set: { password: hash } };
            await users.updateOne(filter, updateDocument);
        } catch(error){
            return { code: 500, data: { message: error.message }};
        }
    } else if(body.newEmail) {
      const { valid } = await isEmailValid(body.newEmail);

      if (!valid) return { code: 400, data: { message: 'Please provide a valid email address.' }};

      if(await isExistRegistration(body.newEmail)) return { code: 400, data: { message: 'Email address is already exist.'}};
      try{
        const updateDocument = { $set: { email: body.newEmail } };
        await users.updateOne(filter, updateDocument);
        if(needToken) token = generateAccessToken(body.newEmail, userInfo.userID);
      } catch(error){
        return { code: 500, data: { message: 'Internal server error.' }};
        }  
    }
    if(token != null) return { code: 200, data: { message: 'Modify was successful.', token: token}};
  return { code: 200, data: { message: 'Modify was successful.' }};
}

export async function isAdmin(userID) {
    const user = await findUserByUserID(userID);
    return (user.admin) ? true : false;
}

export async function getUsersForAdmin() {
    try {
        const listOfUsers = await users.find({}).toArray();
        return { code: 200, data: listOfUsers };
      } catch(error) {
        return {code: 500, data: { message: 'Internal server error.'}};
    }
}

export async function modifyUserByAdmin(body, userInfo) {
    console.log(body);
    try {
        return await setUserData(body, userInfo);
    } catch (error) {
        return { code: 500, data: { message: "Internal server error" }};
    }
}

export async function deleteUserByAdmin(body) {
    try {
        const filter = { userID: body.userID };
        await users.deleteOne(filter);
        return { code: 204, data: { message: "Delete was successful." }};
        } catch (error) {
        return { code: 500, data: { message: "Internal server error" }};
    }
}
