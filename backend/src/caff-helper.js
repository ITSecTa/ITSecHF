import { MongoClient } from "mongodb";


const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const database = client.db("itsecta");
const caff = database.collection("caff");


export async function getCaffCollection() {
    try {
        const listOfCaff = await caff.find({}, { projection: { caffName: 1, caffID: 1, bitmap: 1, comments: 0, _id: 0, file: 0 }}).toArray();
        return { code: 200, data: listOfCaff };
      } catch(error) {
        return {code: 500, data: { message: 'Internal server error.'}};
    }
}

export async function uploadCaffFile(body) {
 console.log(body);

}

const generatePreview = (caffPath, outputPath) => {
    exec(`../parser.exe ${caffPath} ${outputPath}`, (error, stdout, stderr) => stderr);
}