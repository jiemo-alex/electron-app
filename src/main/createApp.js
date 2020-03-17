const { app, BrowserWindow } = require('electron')
const { autoUpdater } = require("electron-updater");
const gfs = require('graceful-fs')
const path = require('path')

function createApp(createWindow) {
  // 选择路径的信息
  global.sharedObject = {
    dirInfo: {
      currentFiles: [],
      basePath: '',
      currentFile: null
    }
  }

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  app.allowRendererProcessReuse = true

  // 创建历史文件
  const historyFile = path.join(app.getPath('appData'), 'histories.json')
  if (! gfs.existsSync(historyFile)) {
    gfs.writeFileSync(historyFile, '[]')
  }

  app.whenReady().then(createWindow).then(_ => {
    autoUpdater.checkForUpdatesAndNotify();
  })

  return app
}

module.exports = createApp;
