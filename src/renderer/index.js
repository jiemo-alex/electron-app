const { ipcRenderer } = require('electron')
const { SELECT_TYPE_DIR } = require('../common/constants')

const elementOpenDir = document.getElementById('open-dir')
const elementHistoryList = document.getElementById('history-list')

elementOpenDir.onclick = event => {
  event.preventDefault()
  ipcRenderer.send('async-select', SELECT_TYPE_DIR)
}

ipcRenderer.on('async-select-reply', (_, path) => {
  console.log(path)
})

ipcRenderer.on('load-history-reply', (_, histories) => {
  histories.forEach(history => {
    const li = document.createElement('li')
    const a = document.createElement('a')
    a.href = "#"
    a.innerText = history
    li.appendChild(a)
    a.onclick = event => {
      event.preventDefault()
      ipcRenderer.send('async-load-path', history)
    }

    elementHistoryList.appendChild(li)
  });
})

ipcRenderer.send('async-load-history')
