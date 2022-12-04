import express from "express";
import fileupload from "express-fileupload";
import cors from "cors";
import multer from "multer";
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
   modifyCommentByAdmin } from "./caff-helper.js";
import dotenv from 'dotenv'; 

//const upload_folder_path = __dirname + "/../temp/";
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);
const output_directory = path.join(__dirname, "/../temp");

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post("/upload-file", async (req, res) => {
  try {
      if (!req.files) {
          res.send({
              status: "failed",
              message: "No file uploaded",
          });
      } else {
          let file = req.files.file;
          //let fileExtension = file.name.split('.')[file.name.split('.').length - 1];

          console.log(file);

          file.mv(output_directory + "/test.png");
          console.log("upload mappa utan")
          res.send({
              status: "success",
              message: "File is uploaded",
              data: {
                  name: file.name,
                  mimetype: file.mimetype,
                  size: file.size,
              },
          });
      }
  } catch (err) {
      res.status(500).send(err);
  }
});


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
  const result = await uploadCaffFile(req.body);
  return res.status(result.code).send(result.data);
  //TODO: fajlfeltoltes sikerült
});

app.get('/caff/purchase', async (req, res) => {
 //TODO el se kezdtuk
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

app.listen(PORT, console.log(`Server started on port ${PORT}`));