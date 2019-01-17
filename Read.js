'use strict';

const PDFParser = require("pdf2json"),
      fs = require("fs"),
      data = require("./data.json");

module.exports = class Read {
  constructor(path,event){
    this.path = path;
    this.text = "";
    this.wordIndex = 0;
    this.speed = 0;
  }

  loadPDF(reload=false){
    return new Promise( (resolve, reject) => {
      if(reload === true || !data.hasOwnProperty(this.path)){
        const pdfParser =  new PDFParser(this,1);
        pdfParser.on("pdfParser_dataError", (errData) => {
          console.error(errData.parserError);
          reject();
        });
        pdfParser.on("pdfParser_dataReady", (pdfData) => {
          this.text = pdfParser.getRawTextContent()
                        .replace(/[\n\t\s]{1,}/g," ")
                        .split(" ");
          resolve();
        });
        pdfParser.loadPDF(this.path);
      } else {
          this.text = data[this.path].text;
          this.wordIndex = data[this.path].actualWord;
          resolve();
      }
    });
  }

  saveData(){
    if (!data.hasOwnProperty(this.path)) {
      data[this.path]={};
    }
    data[this.path].text = this.text;
    data[this.path].actualWord = this.wordIndex;
    data[this.path].totalWords = this.text.length;
    data[this.path].speed = this.speed;
    fs.writeFileSync(__dirname+"/data.json", JSON.stringify(data));
  }
}
