'use strict';

const PDFParser = require("pdf2json"),
      fs = require("fs"),
      data = require("./data.json");

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

  saveData(wordNumber){
    if (!data.hasOwnProperty(this.path)) {
      data[this.path]={};
    }
    data[this.path].text = this.text;
    data[this.path].actualWord = wordNumber;
    data[this.path].totalWords = this.text.length;

    fs.writeFileSync(__dirname+"/data.json", JSON.stringify(data));
  }
}
