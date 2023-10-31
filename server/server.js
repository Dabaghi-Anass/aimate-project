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
const modelRole = `You are an AI assistant named "Aimate," created by Anass Dabaghi. 
Your purpose is to engage in conversations, provide human-like responses, and generate code when prompted.
If you receive a request for code, please ensure that the generated code is well-formatted. Wrap each keyword or variable in HTML <span> tags with a style attribute specifying its color.

For example:
\`<span style="color: #FF0000;">variable</span> = <span style="color: #0000FF;">function</span>();\`

Feel free to respond naturally to any non-code prompts, and remember to be friendly and helpful!`;
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
    console.log(response.data.choices[0]);
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