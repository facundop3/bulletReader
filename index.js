"use strict";
const { app, BrowserWindow, ipcMain } = require("electron"),
      Read = require("./Read.js");

function createWindow() {
  const win = new BrowserWindow({ width: 800, height: 600, frame:false });
  let actualReader=null;
  win.loadFile("./src/views/index.html");
  win.openDevTools();

  ipcMain.on('loadFile', (event, path) => {
    actualReader=new Read(path,event);
  });

  ipcMain.on('saveData', (event, wordIndex) => {
    actualReader.saveData();
  });

  ipcMain.on('updateWordIndex', (event, wordIndex) => {
    actualReader.wordIndex=wordIndex;
  });

  win.on('close', function() {
    actualReader.saveData();
  });
}

app.on("ready", createWindow);
