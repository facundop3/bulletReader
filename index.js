"use strict";
const { app, BrowserWindow, ipcMain } = require("electron"),
      PDFParser = require("pdf2json"),
      pdfParser = new PDFParser(this,1);

function createWindow() {
  const win = new BrowserWindow({ width: 800, height: 600, frame:false });

  win.loadFile("./src/views/index.html");
  win.openDevTools();

  ipcMain.on('loadFile', (event, path) => {
    console.log(path);
    pdfParser.on("pdfParser_dataError", (errData) => {
      console.error(errData.parserError);
    });
    pdfParser.on("pdfParser_dataReady", pdfData => {
      const text = pdfParser.getRawTextContent()
                    .replace(/[\n\t\s]{1,}/g," ")
                    .split(" ");
      event.sender.send('getFile',text);
    });
    pdfParser.loadPDF(path);
  });

}

app.on("ready", createWindow);
