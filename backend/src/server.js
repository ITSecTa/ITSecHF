import express from "express";
import { MongoClient } from "mongodb";
import { passwordStrength } from 'check-password-strength';
import { randomUUID } from "crypto";
import  cookieParser  from "cookie-parser";
import  sessions  from 'express-session';
import { addUser, getSessionID, isEmailValid, isExistRegistration, isValidUser, setSessionID } from "./helper.js";

const app = express();
const oneDay = 1000 * 60 * 60 * 24;

app.use(sessions({
    secret: randomUUID(),
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//serving public file
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

var sessionChecker = (req, res, next) => {    
  console.log(`Session Checker: ${req.session.id}`.green);
  console.log(req.session);
  if (req.session.profile) {
      console.log(`Found User Session`.green);
      next();
  } else {
      console.log(`No User Session Found`.red);
      res.redirect('/login');
  }
};

function isAuthenticatedPages(req, res, next) {
  if (req.session.passport) {
      res.locals.session = req.session.passport;
      return next();
  }
  res.redirect('/');
}

app.post('/user/login', async (req,res) => {
  //TODO : az adabazisbol kikeseni a user,  validalni a jelszot ha minden ok
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password){
    return res.status(400).send({
      message: "Bad request. Email or password missing."
    })
  }
  if(await isValidUser(email, password)){
    await setSessionID(email, req.session);
    console.log(req.session) //Todo: lementeni dbbe 
    return res.status(200).send("OK. You are logged in now.");
  }
  else{
   return res.status(401).send('Bad credentials');
  }
})


app.post("/user/modify", isAuthenticatedPages, async (req, res) => {
     return res.send("Modify");
});

app.get("/logout", (req, res) => {
    console.log(req);
   req.session.destroy();
   //TODO: kikell szedni a sessionID t a usertol 
   res.send('sikeres logout');
})

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


app.listen(PORT, console.log(`Server started on port ${PORT}`));