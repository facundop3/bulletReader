'use strict';

const PDFParser = require("pdf2json"),
      fs = require("fs"),
      data = require("./data.json");

module.exports = class Read {
  constructor(path,event){
    this.path = path;
    this.text = "";
    this.wordIndex = 0;

    if(!data.hasOwnProperty(this.path)){
      const pdfParser =  new PDFParser(this,1);
      pdfParser.on("pdfParser_dataError", (errData) => {
        console.error(errData.parserError);
      });
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        this.text = pdfParser.getRawTextContent()
                      .replace(/[\n\t\s]{1,}/g," ")
                      .split(" ");
        event.sender.send('getFile',this.text,this.wordIndex);
      });
      pdfParser.loadPDF(this.path);
    } else {
        this.text = data[this.path].text;
        this.wordIndex = data[this.path].actualWord;
        event.sender.send('getFile',this.text,this.wordIndex);
    }
  }

  saveData(){
    if (!data.hasOwnProperty(this.path)) {
      data[this.path]={};
    }
    data[this.path].text = this.text;
    data[this.path].actualWord = this.wordIndex;
    data[this.path].totalWords = this.text.length;
    fs.writeFileSync(__dirname+"/data.json", JSON.stringify(data));
  }
}
