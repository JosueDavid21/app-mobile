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
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = require("langchain/llms/openai");
const pdf_1 = require("langchain/document_loaders/fs/pdf");
const text_splitter_1 = require("langchain/text_splitter");
const openai_2 = require("langchain/embeddings/openai");
const faiss_1 = require("langchain/vectorstores/faiss");
const chains_1 = require("langchain/chains");
const prompts_1 = require("langchain/prompts");
dotenv_1.default.config();
class Langchain_PDF {
    constructor() {
        this.model = new openai_1.OpenAI({
            temperature: 0.5,
            modelName: "gpt-3.5-turbo",
            streaming: true,
            callbacks: [
                {
                    handleLLMNewToken(token) {
                        process.stdout.write(token);
                    },
                },
            ],
        });
    }
    main(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.model.call(prompt);
            }
            catch (error) {
                console.error("Error: ", error);
            }
        });
    }
    processPDFToVectorStore(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const loader = new pdf_1.PDFLoader(`./uploads/${name}`, {
                splitPages: false,
            });
            const docs = yield loader.load();
            const splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
                chunkSize: 200,
                chunkOverlap: 50,
            });
            const documents = yield splitter.splitDocuments(docs);
            const embeddings = new openai_2.OpenAIEmbeddings();
            const vectorstore = yield faiss_1.FaissStore.fromDocuments(documents, embeddings);
            yield vectorstore.save("./vector-store-pdf");
            // console.log("PDF to Faiss Vector Store Created successfully");
        });
    }
    useFaissVectorStrore(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            const embeddings = new openai_2.OpenAIEmbeddings();
            const vectorStore = yield faiss_1.FaissStore.load("./vector-store-pdf", embeddings);
            const template = `Si no sabes la respuesta, di simplemente que no la sabes, no intentes inventarte una respuesta. 
    Además, DEBES poner la {question} en mayúsculas al principio de cada respuesta. 
    {context} 
    Question: {question}
    Must Display the Question in full: {question}
    Di siempre "¡Gracias por preguntar!" al final de la respuesta.`;
            const QA_CHAIN_PROMPT = new prompts_1.PromptTemplate({
                inputVariables: ["context", "question"],
                template,
            });
            const chain = new chains_1.RetrievalQAChain({
                combineDocumentsChain: (0, chains_1.loadQAStuffChain)(this.model, {
                    prompt: QA_CHAIN_PROMPT,
                }),
                retriever: vectorStore.asRetriever(),
                returnSourceDocuments: false,
            });
            const res = yield chain.call({
                query: prompt,
            });
            return res;
        });
    }
}
exports.default = Langchain_PDF;
