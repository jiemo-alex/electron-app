const { ipcRenderer } = require('electron')

const elementFileList = document.getElementById('file-list')
const elementSaveBtn = document.getElementById('save-btn')
const elementTextContent = document.getElementById('text-content')
const elementSaveSuccess = document.getElementById('save-success')

const store = {
  currentFile: null
}

function saveFile() {
  ipcRenderer.send('async-save-file', {
    content: elementTextContent.value
  })
}

ipcRenderer.send('async-load-files')
ipcRenderer.on('load-files-reply', (_, {currentFiles, basePath}) => {
  new Notification('Electron Editor', {
    body: '当前文件夹：' + basePath
  })

  currentFiles.forEach(fileName => {
    const li = document.createElement('li')
    const a = document.createElement('a')
    a.href = "#"
    a.innerText = fileName
    li.appendChild(a)
    elementFileList.appendChild(li)

    a.onclick = e => {
      e.preventDefault()
      ipcRenderer.send('async-load-file', fileName)
    }
  });
})

ipcRenderer.on('load-file-reply', (_, {fileName, data}) => {
  elementTextContent.value = data
  store.currentFile = fileName
})

ipcRenderer.on('save-file-reply', _ => {
  elementSaveSuccess.style.display = 'inline-block'
  setTimeout(() => {
    elementSaveSuccess.style.display = 'none'
  }, 1000);
})

ipcRenderer.on('save-hook', _ => {
  saveFile()
})

elementSaveBtn.onclick = event => {
  event.preventDefault()
  saveFile()
}
