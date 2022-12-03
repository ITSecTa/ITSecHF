import { MongoClient } from "mongodb";
import emailValidator from "deep-email-validator";
import * as argon2 from "argon2";
import { passwordStrength } from 'check-password-strength';
import * as crypto from "crypto";

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

export async function isEmailValid(email) {
    return emailValidator.validate(email)
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
        sessionID: null,
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
    let sessionID =  crypto.randomUUID();
    const user = await getUserByEmail(email);
    console.log(user);
    if(!user) return { code: 401, data: { message: 'Bad credential.'}};
    if(await verifyPasswordWithHash(password, user.password)) {
        try {
            await setSessionID(user.userID, sessionID );
        } catch(error) {
            return { code: 500, data: { message: 'Internal server error'}};
        }
        if(user.admin) {
            return  { code: 200, data: { sessionID: sessionID, admin: true }};
        }
        return  { code: 200, data: { sessionID: sessionID }};
    }
    return { code: 401, data: { message: 'Bad credential.'}};
}

export async function setSessionID(userID, session) {
    const filter = { userID: userID };
    const updateDocument = {
        $set: {
            sessionID: session,
         },
    };
   console.log(await users.updateOne(filter, updateDocument));
}

export async function findUserBySessionID(session) {
    const result = await users.findOne( { sessionID: { $eq: session } });
    return result;
}

export async function findUserByUserID(userID) {
    const result = await users.findOne({ userID: { $eq: userID }});
    return result;
}

export async function setUserData(body) {
    // Ha admin van akkor a sessionId HELYETT userId alapjan kell lekerni a usert
    // ha az admin nem kuld userId t akkor a sajat adatait modositja szoval ez nem bug hanem feature :) 
    let user;
    console.log("setuserdata");
    console.log(body);
    if(body.userID) {
        user = await findUserByUserID(body.userID);
    } else {
        user = await findUserBySessionID(body.sessionID);
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
    
          if(await isExistRegistration(body.newEmail)) return { code: 400, data: { message: 'Email address is already exist.'}};
          try{
            const hash = await hashPassword(body.newPassword);
            const updateDocument = { $set: { email: body.newEmail, password: hash } };
            await users.updateOne(filter, updateDocument);
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
      } catch(error){
        return { code: 500, data: { message: 'Internal server error.' }};
        }  
    };
// ha nincs email es nincs jelszo siman visszater 204 el. 
  return { code: 200, data: { message: 'Modify was successful.' }};
}

export async function isAdmin(sessionID) {
        const user = await findUserBySessionID(sessionID);
        return (user.admin) ? true : false;
}

export async function getUsersForAdmin(sessionID) {
    try {
        if(await !isAdmin(sessionID)) return { code: 401, data: { message: 'Bad credentials'}};
        const listOfUsers = await users.find({}).toArray();
        return { code: 200, data: listOfUsers };
      } catch(error) {
        return {code: 500, data: { message: 'Internal server error.'}};
    }
}

export async function modifyUserByAdmin(body) {
    console.log(body);
    try {
        if(!await isAdmin(body.sessionID)) return { code: 401, message: 'Bad credentials8979'};
        return await setUserData(body);
    } catch (error) {
        return { code: 500, data: { message: "Internal server error" }};
    }
}

export async function deleteUserByAdmin(body) {
    try {
        if(!await isAdmin(body.sessionID)) return { code: 401, message: 'Bad credentials8979'};
        const filter = { userID: body.userID };
        const result = await users.deleteOne(filter);
        if (result.deletedCount === 1) {
            return { code: 200, data: { message: "Delete was successful." }};
          } else {
            return {code: 404, data:{ message: "No documents matched the query. Deleted 0 documents."}};
          }
        } catch (error) {
        return { code: 500, data: { message: "Internal server error" }};
    }
}

//Todo: delete admin
//Todo: user modify
//Todo: admin modify