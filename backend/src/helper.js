import { MongoClient } from "mongodb";
import emailValidator from "deep-email-validator";
import * as argon2 from "argon2";

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const database = client.db("itsecta");
const users = database.collection("user");

export async function isEmailValid(email) {
    return emailValidator.validate(email)
}
  
export async function isExistRegistration(email) {
   const result = await getUser(email);
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
      const hash = await argon2.hash(password);
      const newuser = {
        email: email,
        password: hash,
        sessionID: null,
      }
       result = await users.insertOne(newuser);
      console.log(`A user was inserted with the _id: ${result.insertedId}`);
      return result;
    } finally {
      //console.log("Database could not open");
      //await client.close();
    }
}

export async function getUser(email) {
    const result = await users.findOne( { email: { $eq: email } });
    return result;
}

export async function isValidUser(email, password) {
    const user = await getUser(email);
    if(!user) return false;
    if(await argon2.verify(user.password, password)) {
        return true;
    }
    return false;
}

export async function setSessionID(email, session) {
    const filter = { email: email };
    const updateDocument = {
        $set: {
            sessionID: session,
         },
        };
   console.log(await users.updateOne(filter, updateDocument));
}

export async function getSessionID(session) {
    const result = await users.findOne( { sessionID: { $eq: session } });
    return result;
}

//Todo: delete admin
//Todo: user modify
//Todo: admin modify