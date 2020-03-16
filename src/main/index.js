require('dotenv').config()
const { BrowserWindow, dialog } = require('electron')
var gfs = require('graceful-fs')
const { ipcMain } = require('electron')
const createApp = require('./createApp')

const { NODE_ENV, VIEW_PATH } = process.env;
const isDevelopment = NODE_ENV !== 'production'

createApp(() => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (isDevelopment) {
    win.webContents.openDevTools()
  }

  win.loadFile('src/view/index.html')

  // 选择系统路径
  // https://www.electronjs.org/docs/api/dialog
  ipcMain.on('async-select', (event, type) => {
    const result = dialog.showOpenDialog({
      properties: [type]
    })
    result.then(({canceled, filePaths}) => {
      if (!canceled) {
        const path = filePaths[0]
        event.reply('async-select-reply', path)
        // 判断文件或目录
        gfs.readdir(path, (err, files) => {
          console.log(files)
        })
        win.loadFile('src/view/editor.html')
      }
    })
  })

  return win
})
