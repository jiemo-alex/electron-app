const { ipcRenderer } = require('electron')
const { SELECT_TYPE_FILE, SELECT_TYPE_DIR } = require('../common/constants')

const elementOpenFile = document.getElementById('open-file')
const elementOpenDir = document.getElementById('open-dir')

elementOpenFile.onclick = event => {
  event.preventDefault()
  ipcRenderer.send('async-select', SELECT_TYPE_FILE)
}

elementOpenDir.onclick = event => {
  event.preventDefault()
  ipcRenderer.send('async-select', SELECT_TYPE_DIR)
}

ipcRenderer.on('async-select-reply', (event, path) => {
  console.log(path)
})
