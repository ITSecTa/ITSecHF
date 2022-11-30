import express from "express";
import { MongoClient } from "mongodb";
import emailValidator from "deep-email-validator";
import { passwordStrength } from 'check-password-strength';
import { randomUUID } from "crypto";
import { cookieParser } from "cookie-parser";
import { sessions } from 'express-session';



const app = express();
app.use(express.json());
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: randomUUID(),
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));
app.use(express.urlencoded({ extended: true }));
//serving public file
app.use(express.static(__dirname));
app.use(cookieParser());

var session;

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const PORT = process.env.PORT || 8080;

async function isEmailValid(email) {
  return emailValidator.validate(email)
}

async function addUser(email, password) {
  let result;
  try {
    const database = client.db("itsecta");
    const users = database.collection("user");
    // create a document to insert
    const newuser = {
      email: email,
      password: password,
    }
     result = await users.insertOne(newuser);
    console.log(`A user was inserted with the _id: ${result.insertedId}`);
    return result;
  } finally {
    //console.log("Database could not open");
    //await client.close();
  }
}

async function isExistRegistration(email) {
  const database = client.db("itsecta");
  const users = database.collection("user");
  const result = await users.findOne( { email: { $eq: email } });
  console.log(result);
  if(result) {
      console.log("van ilyen email");
      return true;
  }
  console.log("nincs ilyen email");
  return false;
}


app.post("/user/register", async (req, res) => {

  console.log(req.body);
  console.log(req.body.email);
  console.log(req.body.password);
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password){
    return res.status(400).send({
      message: "Bad request.Email or password missing."
    })
  }
  const {valid, reason, validators} = await isEmailValid(email);

  if (!valid) {
    return res.status(400).send({
      message: "Please provide a valid email address.",
      reason: validators[reason].reason
    });
  } 

  if(await isExistRegistration(email)) {
    return res.status(400).send({
      message: "Email address is already used.",
    });
  }

  if(await passwordStrength(password).value !== 'Strong') {
    return res.status(400).send({
      message: "Please provide a strong password",
    });
  } 

  let result_id;
  try {
    result_id = await addUser(req.body.email, req.body.password);
  } catch (error) {
    res.status(500).send({message: "Internal server error. Could not created the registration."})
  } 
  return res.status(201).send({message: "OK", id: result_id});
});

app.post('/user',(req,res) => {
  if(req.body.username == myusername && req.body.password == mypassword){
      session=req.session;
      session.userid=req.body.username;
      console.log(req.session)
      res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
  }
  else{
      res.send('Invalid username or password');
  }
})

app.listen(PORT, console.log(`Server started on port ${PORT}`));