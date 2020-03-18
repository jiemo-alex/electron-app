const { app, ipcMain, dialog } = require('electron')
const path = require('path')
const gfs = require('graceful-fs')
const { saveHistoryFile, saveFile } = require('../common/common')

module.exports = function eventHandler(win) {
  const historyFile = path.join(app.getPath('appData'), 'histories.json')
  const { dirInfo } = global.sharedObject

  // 加载编辑器页面
  const loadPath = (localPath, callback = false) => {
    dirInfo.basePath = localPath
    gfs.readdir(localPath, {encoding: 'utf8'}, (_, files) => {
      saveHistoryFile(historyFile, localPath)
      callback && callback(files)
    })
  }

  // 选择系统路径并加载编辑器页面
  // https://www.electronjs.org/docs/api/dialog
  ipcMain.on('async-select', (_, type) => {
    const result = dialog.showOpenDialog({
      properties: [type]
    })
    result.then(({canceled, filePaths}) => {
      if (!canceled) {
        loadPath(filePaths[0], () => {
          win.webContents.loadFile('src/view/editor.html')
        })
      }
    })
  })

  // 通过路径加载编辑器页面
  ipcMain.on('async-load-path', (_, localPath) => {
    loadPath(localPath, () => {
      win.webContents.loadFile('src/view/editor.html')
    })
  })

  ipcMain.on('async-load-files', (event) => {
    loadPath(dirInfo.basePath, (files) => {
      event.reply('load-files-reply', [files, dirInfo.basePath])
    })
  })

  ipcMain.on('async-load-file', (event, fileName) => {
    const localPath = path.join(dirInfo.basePath, fileName)
    gfs.readFile(localPath, {encoding: 'utf8'}, (err, data) => {
      if (!err) {
        event.reply('load-file-reply', {fileName, data})
      }
    })
  })

  ipcMain.on('async-save-file', (event, {fileName, content}) => {
    saveFile(fileName, content, () => {
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
