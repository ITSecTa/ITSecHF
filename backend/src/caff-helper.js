import { MongoClient, Binary } from "mongodb";
import { exec, execSync } from "node:child_process";
import path from "path";
import * as crypto from "crypto";
import * as fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const directory = path.join(__dirname, "/../../parser/cmake-build-debug");
const output_directory = path.join(__dirname, "/../temp/");

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

async function readfiles(caff_path, output_path) {
    const caff_data = fs.readFileSync(caff_path, { encoding: "utf8"});
    const output_data = fs.readFileSync(output_path + ".bmp", { encoding: "utf8"});

    return {caff_data, output_data };
}

export async function uploadCaffFile(filename) {
 try {
   const caff_path = path.join(output_directory, filename);
   const output_path = path.join(output_directory, "kisnyuszi");
    console.log(fs.existsSync(caff_path))
   console.log(caff_path, "caff_path");
   console.log(output_path, "output_path");
    generatePreview(caff_path, output_path);
    console.log("start2")
    const caff_data = fs.readFileSync(caff_path, { encoding: "base64"});
    console.log("read1")
    const output_data = fs.readFileSync(output_path + ".bmp", { encoding: "base64"});
    console.log("read2")
    const newCAFF = {
        caffName: filename,
        caffID: crypto.randomUUID(),
        file: caff_data,
        bitmap: output_data,
        comments: [],
      }
      console.log(newCAFF);
    await caff.insertOne(newCAFF);
    return { code: 201, data: { message: 'created.', bitmap: output_data}};
 } catch(error) {
    return { code: 400, data: { message: error }};  
 }
}

const generatePreview = (caffPath, outputPath) => {
    console.log("start");
    const parser = path.join(directory, "/parser.exe");
    console.log(parser);
    execSync(`${parser} ${caffPath} ${outputPath}`);
    console.log("end")
}

export async function getCaffByCaffId(caffId){
    try {
        const result = await caff.findOne( { caffID: { $eq: caffId } });
        return { code: 200, data: { caffName: result.caffName, file: result.file }};
    } catch(error) {
        return { code: 500, data: { message: 'Internal server error.'}};  
    }
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