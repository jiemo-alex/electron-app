const { app, Menu } = require('electron')
const { SELECT_TYPE_DIR } = require('../common/constants')

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

    {
      label: '转到(G)',
      submenu: [
        {
          label: '主界面 (M)',
          accelerator: 'CmdOrCtrl+M',
          click: async () => {
            win.loadFile('src/view/index.html')
          }
        }
      ]
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
