require('dotenv').config()
const path = require('path')
const { BrowserWindow, Menu } = require('electron')
const createApp = require('./createApp')
const eventHandler = require('./eventHandler')

const { NODE_ENV } = process.env;
const isDevelopment = NODE_ENV !== 'production'

createApp(_ => {

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'icon.jpg'),
    webPreferences: {
      nodeIntegration: true
    }
  })

  eventHandler(win)
  win.loadFile('src/view/index.html')

  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: '保存',
          click: async () => {
            win.webContents.send('save-hook')
          }
        },
      ]
    },
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  return win
})
