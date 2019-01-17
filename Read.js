'use strict';

const PDFParser = require("pdf2json"),
      fs = require("fs"),
      data = require("./data.json");

let actualReader = null;

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
      event.sender.send('getFile',this.text);
    });
    this.pdfParser.loadPDF(this.path);
    actualReader = this;
  }

  static saveData(wordNumber){
    if (!data.hasOwnProperty(actualReader.path)) {
      data[actualReader.path]={};
    }
    data[actualReader.path].text = actualReader.text;
    if(wordNumber !== null){
      data[actualReader.path].actualWord = wordNumber;
    }
    data[actualReader.path].totalWords = actualReader.text.length;

    console.log(data);
    fs.writeFileSync(__dirname+"/data.json", JSON.stringify(data));
  }
}
