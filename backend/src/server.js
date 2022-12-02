import express from "express";
import { passwordStrength } from 'check-password-strength';
import { addUser, setUserData , isEmailValid, isExistRegistration, isValidUser, setSessionID, findUserBySessionID } from "./helper.js";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;

app.post('/user/login', async (req,res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password){
    return res.status(400).send({
      message: "Bad request. Email or password missing."
    });
  }
  const result = await isValidUser(email, password);
  res.status(result.code).send(result.data);
})


app.post("/user/modify", async (req, res) => {
    if(!req.body.sessionID) {
      return res.status(401).send({ message: 'Bad credentials' });
    } 
    const result = await setUserData(req.body);
    return res.status(result.code).send(result.data);
});


app.post("/user/logout", async (req, res) => {
    console.log(req);
   if(!req.body.sessionID) return res.status(401).send({ message: 'Bad credentials' });
   const user = await findUserBySessionID(req.body.sessionID);
   try {
    await setSessionID(user.userID, null);
   } catch(error) {
    return res.status(500).send({ message: error.message });
   }
   return res.status(204).send({ message: "OK" });
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