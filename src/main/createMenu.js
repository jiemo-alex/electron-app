const { app, Menu } = require('electron')

module.exports = win => {
  const template = [
    {
      label: '文件(F)',
      submenu: [
        {
          label: '新建文件 (N)',
          accelerator: 'CmdOrCtrl+N',
          click: async () => {
            win.webContents.send('create-hook')
          }
        },
        {
          label: '保存 (S)',
          accelerator: 'CmdOrCtrl+S',
          click: async () => {
            win.webContents.send('save-hook')
          }
        },
        {
          label: '退出 (Q)',
          accelerator: 'CmdOrCtrl+Q',
          click: async () => {
            if (process.platform !== 'darwin') {
              app.quit()
            }
          }
        },
      ]
    },
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
