const { app, BrowserWindow } = require('electron')

function createApp(createWindow) {
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

  app.whenReady().then(createWindow)

  return app
}

module.exports = createApp;
