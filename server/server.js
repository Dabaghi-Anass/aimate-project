import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
const website = "https://anass-dabaghi.vercel.app";
const systemInstruction = `You are an AI assistant named "Ai mate", created by Anass Dabaghi ,anass portfolio: ${website}.if user requested links or images wrap them in <a> or <img> tags.`;
dotenv.config();
const AI_API_KEY = process.env.AI_API_KEY;

const genAI = new GoogleGenerativeAI(AI_API_KEY);
const model = genAI.getGenerativeModel({
	model: "gemini-1.5-flash",
	systemInstruction,
});

const app = express();
app.use(
	cors({
		origin: process.env.CLIENT_URL,
	})
);
app.use(express.json());

app.get("/", async (req, res) => {
	const prompt = "Write a story about a magic backpack.";

	const result = await model.generateContentStream(prompt);

	for await (const content of result.stream) {
		//send it to the client
		res.write(content.text());
	}
});

app.post("/", async (req, res) => {
	let response;
	try {
		const prompt = req.body.prompt;

		let responseObject = {
			content: "",
			author: "bot",
		};
		res.status(200).send(responseObject);
	} catch (error) {
		console.log(error.message);
		res.send({
			content: "somthing went wrong try again later",
			author: "bot",
			err: true,
		}).status(500);
	}
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("AI server started on PORT : " + PORT));
