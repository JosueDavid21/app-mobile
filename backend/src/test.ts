import express from "express";
import dotenv from "dotenv";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Converter from "./converter";
import fs from "fs";

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

app.get("/test", async (req, res) => {
  const converter = new Converter();
  try {
    const name = "file.html";
    // const name = "bluetooth_content_share.html";
    if (name.endsWith(".html")) {
      await converter.htmlToPdf(name).catch((error) => {
        res.status(500).send(`Error: ${error}`);
      });
    }
    if (name.endsWith(".xml")) {
      await converter.xmlToPdf(name).catch((error) => {
        res.status(500).send(`Error: ${error}`);
      });
    }
    res.status(200).send("OK");
  } catch (error) {
    res.status(500).send("Error al copiar el archivo");
  }
});

// const jsPDF = require("jspdf");
app.get("/testPDF", async (req, res) => {
  //   const converter = new Converter();
  try {
    const name = "./uploads/file.html";
    // const name = "./uploads/bluetooth_content_share.html";
    const html = fs.readFileSync(name, "utf8");
    const contenidoParrafos = html.match(/<p[^>]*>(.*?)<\/p>/gs);
    let texto = "";
    if (contenidoParrafos) {
      texto = contenidoParrafos.join("\n");
    }
    // const texto = html.replace(/<[^>]+>/g, "");
    const doc = new jsPDF();
    doc.setFontSize(10);
    doc.text(texto, 10, 10);
    console.log(texto);
    doc.save("./uploads/file.pdf");
    res.status(200).send("OK");
  } catch (error) {
    res.status(500).send("Error al copiar el archivo");
  }
});

app.listen(PORT, () => {
  console.log(`running application ${PORT}`);
});
