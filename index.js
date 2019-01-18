"use strict";
const { app, BrowserWindow, ipcMain } = require("electron"),
      Read = require("./Read.js");

function createWindow() {
  const win = new BrowserWindow({ width: 800, height: 600, frame:false });
  let actualReader=null;
  win.loadFile("./src/views/index.html");
  win.openDevTools();

  ipcMain.on("loadFile", async (event, path) => {
    actualReader=new Read(path,event);
    await actualReader.loadPDF();
    event.sender.send("getFile",actualReader.text,actualReader.wordIndex);
  });

  ipcMain.on("reloadFile", async (event, path) => {
    if(actualReader!==null){
      await actualReader.loadPDF(true);
      event.sender.send("getFile",actualReader.text,actualReader.wordIndex);
    }
  });

  ipcMain.on("saveData", (event, wordIndex) => {
    if(actualReader!==null){
      actualReader.saveData();
    }
  });

  ipcMain.on("onSpeedChange", (event, speed) => {
    if(actualReader!==null){
      actualReader.speed=speed;
    }
  });

  ipcMain.on("updateWordIndex", (event, wordIndex) => {
    if(actualReader!==null){
      actualReader.wordIndex=wordIndex;
    }
  });

  win.on("close", function() {
    if(actualReader!==null){
      actualReader.saveData();
    }
  });
}

app.on("ready", createWindow);
