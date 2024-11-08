import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import fs from "fs";
const website = "https://anass-dabaghi.vercel.app";
const systemInstruction = `You are an AI assistant named "Ai mate", created by Anass Dabaghi ,anass portfolio: ${website}. make sure to respond with markdown format`;
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

async function sleep(seconds) {
	return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
const fileContent = fs.readFileSync("response.txt", "utf-8");
const linesArray = fileContent.split("\n");

const chatsMap = new Map();
// app.post("/", async (req, res) => {
// 	try {
// 		res.setHeader("Content-Type", "text/event-stream");
// 		res.setHeader("Cache-Control", "no-cache");
// 		res.setHeader("Connection", "keep-alive");
// 		res.setHeader("Transfer-Encoding", "chunked");
// 		//get request ip address
// 		// chatsMap.set(req.ip, chatsMap.get(req.ip));
// 		// chats[req.ip] = chats[req.ip] || [];
// 		for (const line of linesArray) {
// 			res.write(line + "\n");
// 			// await sleep(0.04);
// 		}
// 		res.end();
// 	} catch (error) {
// 		res.write("\nSomething went wrong. Please try again later.");
// 		res.end();
// 	}
// });
app.post("/", async (req, res) => {
	try {
		res.setHeader("Content-Type", "text/event-stream");
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Connection", "keep-alive");
		res.setHeader("Transfer-Encoding", "chunked");
		const prompt = req.body.prompt;
		console.log("request from ", req.hostname);
		const result = await model.generateContentStream(prompt);
		for await (const content of result.stream) {
			res.write(content.text());
		}

		res.end();
	} catch (error) {
		res.write("\nSomething went wrong. Please try again later.");
		res.end();
	}
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("AI server started on PORT : " + PORT));
