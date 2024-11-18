import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
const website = "https://anass-dabaghi.vercel.app";
const systemInstruction = `You are an AI assistant named "Ai mate", created by Anass Dabaghi ,anass portfolio: ${website}. make sure to respond with markdown format,if images requested send them in markdown syntax`;
dotenv.config();
const AI_API_KEY = process.env.AI_API_KEY;

const genAI = new GoogleGenerativeAI(AI_API_KEY);
const model = genAI.getGenerativeModel({
	model: "gemini-1.5-pro-002",
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

const chatsMap = new Map();
app.post("/", async (req, res) => {
	try {
		//track last request of the same ip
		//if the same ip is making a request, we will use the same chat session
		//to keep the conversation going
		//if the ip is new, we will create a new chat session
		//and store it in the map

		//set headers for server sent events
		res.setHeader("Content-Type", "text/event-stream");
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Connection", "keep-alive");
		res.setHeader("Transfer-Encoding", "chunked");
		const prompt = req.body.prompt;

		/*
			{
				lastVisited: number,
				chatSession: ChatSession,
			}
		*/
		let metaData = chatsMap.get(req.ip);
		if (!metaData) {
			metaData = {
				lastVisited: 0,
				chatSession: model.startChat({
					history: [],
					generationConfig: {
						maxOutputTokens: 3000,
					},
				}),
			};
			chatsMap.set(req.ip, { ...metaData });
		}
		metaData.lastVisited = 0;

		const result = await metaData.chatSession.sendMessageStream(prompt);

		for await (const content of result.stream) {
			res.write(content.text());
		}
	} catch (error) {
		console.error(error.message);
		res.write("\nSomething went wrong. Please try again later.");
	} finally {
		res.end();
	}
});
const PORT = process.env.PORT || 3000;

setInterval(() => {
	for (const [key, value] of chatsMap.entries()) {
		value.lastVisited++;
		if (value.lastVisited > 60) {
			chatsMap.delete(key);
		}
	}
}, 60000);

app.listen(PORT, () => console.log("AI server started on PORT : " + PORT));
