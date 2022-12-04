import { MongoClient } from "mongodb";
import { exec } from "node:child_process";
import path from "path";
import * as crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const directory = path.join(__dirname, "/../../parser/cmake-build-debug");
const output_directory = path.join(__dirname, "/../temp");

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const database = client.db("itsecta");
const caff = database.collection("caff");


export async function getCaffCollection() {
    try {
        const listOfCaff = await caff.find({}, { projection: { caffName: 1, caffID: 1, bitmap: 1}}).toArray();
        return { code: 200, data: listOfCaff };
      } catch(error) {
        return {code: 500, data: { message: 'Internal server error.'}};
    }
}

export async function uploadCaffFile(body) {
 console.log(body);
 if(!body.caffName || !body.file) return { code: 400, data: { message: 'Bad request. Some data is missing.'}};  
 try {
   // await generatePreview(body.file, path.join(output_directory, "/elefant"));
    const newCAFF = {
        caffName: body.caffName,
        caffID: crypto.randomUUID(),
        file: body.file, //kell majd elotte a base64 es resz 
        bitmap: path.join(output_directory, '/elefant'),
        comments: [],
      }
    await caff.insertOne(newCAFF);
    return { code: 201, data: { message: 'created.'}};
 } catch(error) {
    return { code: 400, data: { message: 'Could not create a bitmap because the caff file is invalid.'}};  
 }
}

const generatePreview = async (caffPath, outputPath) => {
    console.log("start");
    const parser = path.join(directory, "/parser.exe");
    console.log(parser);
    exec(`${parser} ${caffPath} ${outputPath}`, (error, stdout, stderr) => stderr);
}

export async function deleteCaffByAdmin(body){
    if(!body.caffID) return { code: 400, data: { message: 'Bad request. Some data is missing.'}}; 
     try {
        const filter = { caffID: body.caffID };
        await caff.deleteOne(filter);
        return { code: 204, data: { message: "Delete was successful." }};
     } catch(error){
        return { code: 500, data: { message: 'Internal server error.'}};  
     }
}

export async function getCommentsByCaffId(caffId) {
   try {
    const result = await caff.findOne( { caffID: { $eq: caffId } });
    return { code: 200, data: { comments: result.comments }};
   } catch(error) {
    return { code: 500, data: { message: 'Internal server error.'}};  
   }
}

export async function addCommentToCaff(caffId, body) {
    if(!body.text) return { code: 400, data: { message: 'Bad request. Some data is missing.'}}; 
    try {
       await caff.updateOne({ caffID: { $eq: caffId }}, { $push: { comments: { commentID: crypto.randomUUID(), text: body.text }}});
       return { code: 200, data: { message: "Added a new comment to the caff." }};
    } catch (error) {
        return { code: 500, data: { message: 'Internal server error.'}};  
    }
}

export async function deleteCommentByAdmin(caffId, body) {
    if(!body.commentID) return { code: 400, data: { message: 'Bad request. Some data is missing.'}}; 
    try {
        await caff.updateOne({ caffID: { $eq: caffId }}, { $pull: { comments: { commentID: body.commentID }}});
        return { code: 204, data: { message: "Delete was successful" }};
    } catch(error) {
        return { code: 500, data: { message: 'Internal server error.'}};  
    }
}

export async function modifyCommentByAdmin(caffId, body) {
    if(!body.commentID || !body.text) return { code: 400, data: { message: 'Bad request. Some data is missing.'}}; 
    try {
        await caff.updateOne({ caffID: caffId, "comments.commentID": body.commentID}, { $set: {"comments.$.text": body.text}});
        return { code: 204, data: { message: "Modify was successful" }};
    } catch(error) {
        return { code: 500, data: { message: 'Internal server error.'}};  
    }
}