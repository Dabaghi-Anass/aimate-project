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

app.post("/", async (req, res) => {
  let response;
  try {
    console.log("recieved request");
    const prompt = req.body.prompt;
    response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 1, // Higher values means the model will take more risks.
      max_tokens: 4000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 2.0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 2, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });
    res.status(200).send({
      content: response.data.choices[0].text,
      author: "bot",
    });
  } catch (error) {
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
