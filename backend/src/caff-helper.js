import { MongoClient } from 'mongodb';
import { execSync } from 'node:child_process';
import path from 'path';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const directory = path.join(__dirname, '/../../parser/cmake-build-debug');
const output_directory = path.join(__dirname, '/../temp/');

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const database = client.db('itsecta');
const caff = database.collection('caff');

function clearTempFolder() {
	fs.readdir(output_directory, (err, files) => {
		if (err) throw err;
		for (const file of files) {
			fs.unlink(path.join(output_directory, file), (err) => {
				if (err) throw err;
			});
		}
	});
}

export async function getCaffCollection() {
	try {
		const listOfCaff = await caff.find({}, { projection: { _id: 0, caffName: 1, caffID: 1, bitmap: 1 } }).toArray();
		return { code: 200, data: listOfCaff };
	} catch (error) {
		return { code: 500, data: { message: 'Internal server error.' } };
	}
}

export async function uploadCaffFile(filename) {
	try {
		const caff_path = path.join(output_directory, filename);
		const output_path = path.join(output_directory, 'kisnyuszi');
		generatePreview(caff_path, output_path);
		const caff_data = fs.readFileSync(caff_path, { encoding: 'base64' });
		const output_data = fs.readFileSync(output_path + '.bmp', { encoding: 'base64' });
		const newCAFF = {
			caffName: filename,
			caffID: crypto.randomUUID(),
			file: caff_data,
			bitmap: output_data,
			comments: [],
		};
		await caff.insertOne(newCAFF);
		clearTempFolder();
		return { code: 201, data: { caffID: newCAFF.caffID, caffName: newCAFF.caffName, bitmap: newCAFF.bitmap } };
	} catch (error) {
		clearTempFolder();
		return { code: 400, data: { message: 'Internal server error.' } };
	}
}

const generatePreview = (caffPath, outputPath) => {
	const parser = path.join(directory, '/parser.exe');
	execSync(`${parser} ${caffPath} ${outputPath}`);
};

export async function getCaffByCaffId(caffId) {
	try {
		const result = await caff.findOne({ caffID: { $eq: caffId } });
		return { code: 200, data: { caffName: result.caffName, file: result.file } };
	} catch (error) {
		return { code: 500, data: { message: 'Internal server error.' } };
	}
}

export async function deleteCaffByAdmin(caffId) {
	try {
		const filter = { caffID: caffId };
		await caff.deleteOne(filter);
		return { code: 204, data: { message: 'Delete was successful.' } };
	} catch (error) {
		return { code: 500, data: { message: 'Internal server error.' } };
	}
}

export async function getCommentsByCaffId(caffId) {
	try {
		const result = await caff.findOne({ caffID: { $eq: caffId } });
		return { code: 200, data: { comments: result.comments } };
	} catch (error) {
		return { code: 500, data: { message: 'Internal server error.' } };
	}
}

export async function addCommentToCaff(caffId, body) {
	if (!body.text) return { code: 400, data: { message: 'Bad request. Some data is missing.' } };
	try {
		await caff.updateOne({ caffID: { $eq: caffId } }, { $push: { comments: { commentID: crypto.randomUUID(), text: body.text } } });
		return { code: 201, data: { message: 'Added a new comment to the caff.' } };
	} catch (error) {
		return { code: 500, data: { message: 'Internal server error.' } };
	}
}

export async function deleteCommentByAdmin(caffId, body) {
	if (!body.commentID) return { code: 400, data: { message: 'Bad request. Some data is missing.' } };
	try {
		await caff.updateOne({ caffID: { $eq: caffId } }, { $pull: { comments: { commentID: body.commentID } } });
		return { code: 204, data: { message: 'Delete was successful' } };
	} catch (error) {
		return { code: 500, data: { message: 'Internal server error.' } };
	}
}

export async function modifyCommentByAdmin(caffId, body) {
	if (!body.commentID || !body.text) return { code: 400, data: { message: 'Bad request. Some data is missing.' } };
    if (body.text.length > 500) return { code: 400, data: { message: 'Bad request. The comment text is too long. The maximum size is 500 characters.' } };
	try {
		await caff.updateOne({ caffID: caffId, "comments.commentID": body.commentID }, { $set: { "comments.$.text": body.text } });
		return { code: 204, data: { message: 'Modify was successful' } };
	} catch (error) {
		return { code: 500, data: { message: 'Internal server error.' } };
	}
}
