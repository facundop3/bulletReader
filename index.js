const { app, BrowserWindow } = require('electron')

function createWindow() {
  const win = new BrowserWindow({ width: 800, height: 600, frame:false })

  win.loadFile('./src/views/index.html')
}

app.on('ready', createWindow)