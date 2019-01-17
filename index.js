"use strict";
const { app, BrowserWindow, ipcMain } = require("electron"),
      Read = require("./Read.js");

function createWindow() {
  const win = new BrowserWindow({ width: 800, height: 600, frame:false });

  win.loadFile("./src/views/index.html");
  win.openDevTools();

  ipcMain.on('loadFile', (event, path) => {
    new Read(path,event);
  });
  ipcMain.on('savePDFData', (event, message) => {
    if (!fs.existsSync("./data/")) {
      fs.mkdirSync("./data/");
    }
    fs.writeFileSync(__dirname+"data/"+message.name, JSON.stringify(message));
  });
}

app.on("ready", createWindow);
