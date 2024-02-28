"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const langchain_PDF_1 = __importDefault(require("./langchain_PDF"));
const langchain = new langchain_PDF_1.default();
langchain.processPDFToVectorStore();
langchain.useFaissVectorStrore("de que trata el texto?");
