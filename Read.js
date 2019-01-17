'use strict';

const PDFParser = require("pdf2json"),
      fs = require("fs");

module.exports = class Read {
  constructor(path,event){
    this.path = path;
    this.pdfParser =  new PDFParser(this,1);
    this.text = "";
    this.pdfParser.on("pdfParser_dataError", (errData) => {
      console.error(errData.parserError);
    });
    this.pdfParser.on("pdfParser_dataReady", (pdfData) => {
      this.text = this.pdfParser.getRawTextContent()
                    .replace(/[\n\t\s]{1,}/g," ")
                    .split(" ");
      event.sender.send('getFile',this);
    });
    this.pdfParser.loadPDF(this.path);
  }
}
