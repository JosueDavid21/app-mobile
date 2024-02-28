// import cors from "cors";
// import multer from "multer";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import express from "express";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import Langchain_PDF from "./langchain_PDF";

dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT;
const cors = require("cors");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//    ************      API Rest User      ************
let names = [
  {
    id: uuidv4(),
    firstName: "Josue",
    lastName: "David",
  },
];

app.get("/nombres", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(names);
});
app.get("/nombres/:id", (req, res) => {
  const searchedName = names.find((n) => n.id === req.params.id);
  if (!searchedName) res.status(400).end();
  res.send(searchedName);
});
app.post("/nombres", (req, res) => {
  const item = { ...req.body, id: uuidv4() };
  names.push(item);
  res.send(item);
});
app.delete("/nombres/:id", (req, res) => {
  names = names.filter((n) => n.id !== req.params.id);
  res.status(204).end();
});
app.put("/nombres/:id", (req, res) => {
  const index = names.findIndex((n) => n.id === req.params.id);
  if (index === -1) res.status(404).end();
  names[index] = { ...req.body, id: req.params.id };
  res.status(204).end();
});

//    ************      API Rest OpenAI Convert      ************
app.post("/openapi", async (req, res) => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["human", "Convierte este numero {topic} en binario"],
  ]);
  const model = new ChatOpenAI({});
  const outputParser = new StringOutputParser();
  const chain = prompt.pipe(model).pipe(outputParser);
  const response = await chain.invoke({
    topic: req.body.num,
  });
  res.send({ result: response });
});

//    ************      API Rest OpenAI PDF      ************
const multer = require("multer");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "uploads/");
  },
  filename: function (req: any, file: any, cb: any) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
app.post("/upload", async (req, res) => {
  const langchain = new Langchain_PDF();
  const copyFilePromise = new Promise((resolve, reject) => {
    req.pipe(fs.createWriteStream(`./uploads/${req.headers.name}`))
       .on('finish', resolve)
       .on('error', reject);
  });
  try {
    await copyFilePromise;
    const name: string = req.headers.name as string;
    const question: string = req.headers.question as string;
    await langchain.processPDFToVectorStore(name);
    const response = await langchain.useFaissVectorStrore(question);
    res.send(response.text);
  } catch (error) {
    res.status(500).send("Error al copiar el archivo");
  }
});


app.listen(PORT, () => {
  console.log(`running application ${PORT}`);
});
