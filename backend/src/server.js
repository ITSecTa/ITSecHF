import express from "express";
import { passwordStrength } from 'check-password-strength';
import { addUser,
   setUserData , 
   isEmailValid, 
   isExistRegistration,
   isValidUser,
   getUsersForAdmin,
   modifyUserByAdmin,
   deleteUserByAdmin,
   authenticateToken,
   authenticateAdminToken
  } from "./helper.js";
import dotenv from 'dotenv'; 


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

const PORT = process.env.PORT || 8080;

//USER ENDPOINTS
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


app.post("/user/modify", authenticateToken, async (req, res) => {
    console.log("token:");
    console.log(req.user);
    console.log("tokenvege");
    const result = await setUserData(req.body, req.user);
    return res.status(result.code).send(result.data);
});

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
    return res.status(500).send({message: "Internal server error. Could not created the registration."})
  } 
  return res.status(201).send({message: "OK", id: result_id});
});

//ADMIN ENPOINTS
app.get('/admin/users', authenticateAdminToken, async (req,res) => {
  const result = await getUsersForAdmin(req.user.userID);
  return res.status(result.code).send(result.data);
});

app.post('/admin/modify', authenticateAdminToken, async (req, res) => {
  console.log(req.body);
  const result = await modifyUserByAdmin(req.body, req.user.userID);
  return res.status(result.code).send(result.data);
});

app.post('/admin/delete', authenticateAdminToken, async (req, res) => {
  console.log(req.body);
  const result =  await deleteUserByAdmin(req.body, req.user.userID);
  return res.status(result.code).send(result.data);
})

app.listen(PORT, console.log(`Server started on port ${PORT}`));