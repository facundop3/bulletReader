"use strict";
const { app, BrowserWindow, ipcMain } = require("electron"),
      PDFParser = require("pdf2json"),
      fs = require("fs");

function createWindow() {
  const win = new BrowserWindow({ width: 800, height: 600, frame:false });

  win.loadFile("./src/views/index.html");
  win.openDevTools();

  ipcMain.on('loadFile', (event, path) => {
    const pdfParser = new PDFParser(this,1);
    pdfParser.on("pdfParser_dataError", (errData) => {
      console.error(errData.parserError);
    });
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      const text = pdfParser.getRawTextContent()
                    .replace(/[\n\t\s]{1,}/g," ")
                    .split(" ");
      event.sender.send('getFile',text,path);
    });
    pdfParser.loadPDF(path);
  });
  ipcMain.on('savePDFData', (event, message) => {
    if (!fs.existsSync("./data/")) {
      fs.mkdirSync("./data/");
    }
    fs.writeFileSync(__dirname+"data/"+message.name, JSON.stringify(message));
  });
}

app.on("ready", createWindow);
