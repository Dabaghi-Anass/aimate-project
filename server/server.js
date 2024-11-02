import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
const website = "https://anass-dabaghi.vercel.app";
const systemInstruction = `You are an AI assistant named "Ai mate", created by Anass Dabaghi ,anass portfolio: ${website}.if user requested links wrap them in <a> tag. make sure to respond with markdown format`;
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

app.get("/healthcheck", async (req, res) => {
	res.send({ status: "ok" });
});

app.post("/", async (req, res) => {
	try {
		const prompt = req.body.prompt;

		const result = await model.generateContentStream(prompt);

		for await (const content of result.stream) {
			res.write(content.text());
		}
	} catch (error) {
		res.status(500).send({
			content: "somthing went wrong try again later",
			author: "bot",
			err: true,
		});
	}
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("AI server started on PORT : " + PORT));
