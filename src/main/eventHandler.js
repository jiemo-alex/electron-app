const { app, ipcMain, dialog, getGlobal } = require('electron')
const path = require('path')
const gfs = require('graceful-fs')
const { saveHistoryFile, saveFile } = require('../common/common')

module.exports = function eventHandler(win) {
  const historyFile = path.join(app.getPath('appData'), 'histories.json')

  const { dirInfo } = global.sharedObject

  // 加载编辑器页面
  const loadPath = localPath => {
    dirInfo.basePath = localPath
    gfs.readdir(localPath, {encoding: 'utf8'}, (_, files) => {
      dirInfo.currentFiles = files
      saveHistoryFile(historyFile, localPath)
      win.webContents.loadFile('src/view/editor.html')
    })
  }

  // 选择系统路径
  // https://www.electronjs.org/docs/api/dialog
  ipcMain.on('async-select', (_, type) => {
    const result = dialog.showOpenDialog({
      properties: [type]
    })
    result.then(({canceled, filePaths}) => {
      if (!canceled) {
        loadPath(filePaths[0])
      }
    })
  })

  ipcMain.on('async-load-path', (_, localPath) => {
    loadPath(localPath)
  })

  ipcMain.on('async-load-files', (event) => {
    event.reply('load-files-reply', dirInfo)
  })

  ipcMain.on('async-load-file', (event, fileName) => {
    const localPath = path.join(dirInfo.basePath, fileName)
    gfs.readFile(localPath, {encoding: 'utf8'}, (err, data) => {
      if (!err) {
        dirInfo.currentFile = fileName
        event.reply('load-file-reply', {fileName, data})
      }
    })
  })

  ipcMain.on('async-save-file', (event, {content}) => {
    saveFile(content, () => {
      event.reply('save-file-reply')
    })
  })

  ipcMain.on('async-load-history', (event) => {
    gfs.readFile(historyFile, (_, data) => {
      const json = JSON.parse(data)
      event.reply('load-history-reply', json)
    })
  })
}
