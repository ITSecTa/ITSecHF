import express from "express";
import fileupload from "express-fileupload";
import cors from "cors";
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
  } from "./user-helper.js";
import { getCaffCollection,
   uploadCaffFile,
   deleteCaffByAdmin,
   getCommentsByCaffId, 
   addCommentToCaff,
   deleteCommentByAdmin,
   modifyCommentByAdmin,
   getCaffByCaffId } from "./caff-helper.js";
import dotenv from 'dotenv'; 
import fs from "fs";
import https from "https";

//const upload_folder_path = __dirname + "/../temp/";
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);
const output_directory = path.join(__dirname, "/../temp/");

const httpsOptions = {
  key: fs.readFileSync('backend\\res\\fixtures\\keys\\client-key.pem'),
  cert: fs.readFileSync('backend\\res\\fixtures\\keys\\client-cert.pem')
};

const useHttps = true;

const app = express();
app.use(
  fileupload({
      createParentPath: true,
  }),
); 
app.use(cors({
  origin: ['http://localhost:3000', 'https://localhost:3000'],
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  allowedHeaders: ['Accept', 'Content-Type', 'Authorization']
}));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({limit: '10mb', extended: true }));

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
    console.log(req.user);
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
  const result = await getUsersForAdmin();
  return res.status(result.code).send(result.data);
});

app.post('/admin/modify', authenticateAdminToken, async (req, res) => {
  console.log(req.body);
  const result = await modifyUserByAdmin(req.body, req.user);
  return res.status(result.code).send(result.data);
});

app.post('/admin/delete', authenticateAdminToken, async (req, res) => {
  console.log(req.body);
  const result =  await deleteUserByAdmin(req.body, req.user);
  return res.status(result.code).send(result.data);
});

//CAFF ENDPOINTS
app.get('/caff/preview', async (req,res) => {
  const result = await getCaffCollection();
  return res.status(result.code).send(result.data);
});

app.post('/caff/upload', async (req, res) => {
  try {
    if (!req.files) {
        res.status(400).send({
            status: "failed",
            message: "No file uploaded",
        });
    } else {
        let file = req.files.file
        console.log(file);
        
        await file.mv(output_directory + file.name);
        console.log("upload mappa utan");

        const result = await uploadCaffFile(file.name);
        return res.status(result.code).send(result.data);
    } 
  } catch (err) {
      res.status(500).send({ message: err });
  }
});

app.get('/caff/purchase/:caffId', async (req, res) => {
 if(!req.params.caffId) res.status(404).send({message: "Not found"});
  const result = await getCaffByCaffId(req.params.caffId);
  return res.status(result.code).send(result.data);
}); 

app.delete('/caff/delete', authenticateAdminToken, async (req,res) => {
  const result = await deleteCaffByAdmin(req.body);
  return res.status(result.code).send(result.data);
});

//COMMENTS ENDPOINTS
app.get('/comments/:caffId', async (req,res) => {
  console.log(req.params.caffId);
  if(!req.params.caffId) res.status(404).send({message: "Not found"});
  const result = await getCommentsByCaffId(req.params.caffId);
  return res.status(result.code).send(result.data);
});

app.post('/comments/add/:caffId', authenticateToken, async (req, res) => {
  console.log(req.params.caffId);
  if(!req.params.caffId) res.status(404).send({message: "Not found"});
  const result = await addCommentToCaff(req.params.caffId, req.body);
  return res.status(result.code).send(result.data);
});

app.delete('/comments/delete/:caffId', authenticateAdminToken, async (req,res) => {
  console.log(req.params.caffId);
  if(!req.params.caffId) res.status(404).send({message: "Not found"});
  const result = await deleteCommentByAdmin(req.params.caffId, req.body);
  return res.status(result.code).send(result.data);
});

app.post('/comments/modify/:caffId', authenticateAdminToken , async (req, res) => {
  console.log(req.params.caffId);
  if(!req.params.caffId) res.status(404).send({message: "Not found"});
  const result = await modifyCommentByAdmin(req.params.caffId, req.body);
  return res.status(result.code).send(result.data);
});

if (useHttps) {
  https.createServer(httpsOptions, app).listen(PORT);
  console.log(`HTTPS Server started on port ${PORT}`);
} else {
  app.listen(PORT, console.log(`Server started on port ${PORT}`));
}