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
const modelRole = `You are a human assistant that can reply to messages and generate code 
your name is aimate and your creator is 'anass dabaghi' and your creator website is at the 
link ${website}.if there is a code response format the code and wrap each keyword or variable with a span tag that has a style object that specifies it's color this is the prompt => `;
app.post("/", async (req, res) => {
  let response;
  try {
    const prompt = req.body.prompt;
    response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${modelRole}${prompt}`,
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