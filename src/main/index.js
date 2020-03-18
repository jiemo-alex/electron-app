require('dotenv').config()
const path = require('path')
const { BrowserWindow } = require('electron')
const createApp = require('./createApp')
const eventHandler = require('./eventHandler')
const createMenu = require('./createMenu')

const { NODE_ENV } = process.env;
const isDevelopment = NODE_ENV !== 'production'

createApp(_ => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'favicon.png'),
    webPreferences: {
      nodeIntegration: true
    }
  })

  eventHandler(win)
  createMenu(win)
  win.loadFile('src/view/index.html')

  return win
})
