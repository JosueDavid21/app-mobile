"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import cors from "cors";
// import multer from "multer";
const dotenv_1 = __importDefault(require("dotenv"));
const uuid_1 = require("uuid");
const express_1 = __importDefault(require("express"));
const openai_1 = require("@langchain/openai");
const prompts_1 = require("@langchain/core/prompts");
const output_parsers_1 = require("@langchain/core/output_parsers");
const langchain_PDF_1 = __importDefault(require("./langchain_PDF"));
const joinPdf_1 = __importDefault(require("./joinPdf"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = process.env.PORT;
const cors = require("cors");
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
//    ************      API Rest User      ************
let names = [
    {
        id: (0, uuid_1.v4)(),
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
    if (!searchedName)
        res.status(400).end();
    res.send(searchedName);
});
app.post("/nombres", (req, res) => {
    const item = Object.assign(Object.assign({}, req.body), { id: (0, uuid_1.v4)() });
    names.push(item);
    res.send(item);
});
app.delete("/nombres/:id", (req, res) => {
    names = names.filter((n) => n.id !== req.params.id);
    res.status(204).end();
});
app.put("/nombres/:id", (req, res) => {
    const index = names.findIndex((n) => n.id === req.params.id);
    if (index === -1)
        res.status(404).end();
    names[index] = Object.assign(Object.assign({}, req.body), { id: req.params.id });
    res.status(204).end();
});
//    ************      API Rest OpenAI Convert      ************
app.post("/openapi", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = prompts_1.ChatPromptTemplate.fromMessages([
        ["human", "Convierte este numero {topic} en binario"],
    ]);
    const model = new openai_1.ChatOpenAI({});
    const outputParser = new output_parsers_1.StringOutputParser();
    const chain = prompt.pipe(model).pipe(outputParser);
    const response = yield chain.invoke({
        topic: req.body.num,
    });
    res.send({ result: response });
}));
//    ************      API Rest OpenAI PDF      ************
const fs = require("fs");
app.post("/upload", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const copyFilePromise = new Promise((resolve, reject) => {
        req
            .pipe(fs.createWriteStream(`./uploads/${req.headers.name}`))
            .on("finish", resolve)
            .on("error", reject);
    });
    try {
        yield copyFilePromise;
        res.send(copyFilePromise);
    }
    catch (error) {
        res.status(500).send("Error al copiar el archivo");
    }
}));
app.get("/question", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const langchain = new langchain_PDF_1.default();
    try {
        const question = req.query.question;
        const pdfs = JSON.parse(req.query.pdfs);
        let name = "";
        if (pdfs.length > 1) {
            const pdfString = [];
            for (let i = 0; i < pdfs.length; i++) {
                pdfString.push(`./uploads/${pdfs[i].title}`);
            }
            new joinPdf_1.default()
                .unirPDFs(pdfString, "./uploads/joinPdf.pdf")
                .catch((error) => console.error("Error:", error));
            name = "joinPdf.pdf";
        }
        else {
            name = pdfs[0].title;
        }
        yield langchain.processPDFToVectorStore(name);
        const response = yield langchain.useFaissVectorStrore(question);
        res.send(response.text);
    }
    catch (error) {
        res.status(500).send("Error generando respuesta");
    }
}));
//    ************      API Rest PDF to Text      ************
const pdfPasrse = require("pdf-parse");
app.get("/getText", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pdf = `./uploads/${req.query.name}`;
        let dataBuffer = fs.readFileSync(pdf);
        pdfPasrse(dataBuffer).then(function (data) {
            res.send(data.text);
        });
    }
    catch (error) {
        res.status(500).send("Error al obtener texto del PDF");
    }
}));
app.listen(PORT, () => {
    console.log(`running application ${PORT}`);
});
