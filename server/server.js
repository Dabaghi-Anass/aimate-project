import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();
// token
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors({
  origin : "*"
}));
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from Anass!",
  });
});
const website = "https://anass-dabaghi.vercel.app";
const modelRole = `You are an AI assistant named "Aimate," created by Anass Dabaghi. anass contact link : ${website}.
Your purpose is to engage in conversations and generate code when prompted.If you receive a request for code, format the code, Wrap each keyword or variable in span tags with a style attribute specifying its color.respond naturally to any non-code prompts`;
app.post("/", async (req, res) => {
  let response;
  try {
    const prompt = req.body.prompt;
    response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${modelRole}\n${prompt}`,
      temperature: 1,
      max_tokens: 4000,
      top_p: 1,
      frequency_penalty: 2.0,
      presence_penalty: 2,
    });
    console.log("recieved request");
    console.log(response.data.choices);
    res.status(200).send({
      content: response.data.choices[0].text,
      author: "bot",
    });
    
  } catch (error) {
    console.log(error.message)
    res
      .send({
        content: "somthing went wrong try again later",
        author: "bot",
        err: true,
      })
      .status(500);
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("AI server started on PORT : " + PORT));