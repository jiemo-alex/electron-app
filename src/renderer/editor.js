const { ipcRenderer } = require('electron')

const elementFileList = document.getElementById('file-list')
const elementNewBtn = document.getElementById('new-btn')
const elementSaveBtn = document.getElementById('save-btn')
const elementDialogActive = document.getElementById('dialog-active')
const elementDialogCancel = document.getElementById('dialog-cancel')
const elementTextContent = document.getElementById('text-content')
const elementSaveSuccess = document.getElementById('save-success')

const store = {
  currentFile: null
}

function saveFile(content = false) {
  const value = content === false ? elementTextContent.value : content
  ipcRenderer.send('async-save-file', {
    fileName: store.currentFile,
    content: value
  })
}

function createFile(fileName) {
  store.currentFile = fileName
  saveFile('')
}

function reloadFileList() {
  elementFileList.innerText = ''
  ipcRenderer.send('async-load-files')
}

function dialogCancel() {
  document.getElementById('dialog-wrapper').style.display = 'none'
}

function dialogShow() {
  document.getElementById('dialog-wrapper').style.display = 'block'
}

ipcRenderer.on('load-files-reply', (_, [currentFiles, basePath]) => {
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
  elementTextContent.style.visibility = 'visible'
  elementTextContent.value = data
  store.currentFile = fileName
})

ipcRenderer.on('save-file-reply', _ => {
  reloadFileList()
  ipcRenderer.send('async-load-file', store.currentFile)
  elementSaveSuccess.style.display = 'inline-block'
  setTimeout(() => {
    elementSaveSuccess.style.display = 'none'
  }, 1000);
})

ipcRenderer.on('save-hook', _ => {
  saveFile()
})

ipcRenderer.on('create-hook', _ => {
  dialogShow()
})

elementSaveBtn.onclick = event => {
  event.preventDefault()
  saveFile()
}

elementNewBtn.onclick = event => {
  event.preventDefault()
  dialogShow()
}

elementDialogActive.onclick = event => {
  event.preventDefault()
  const fileName = document.getElementById('dialog-input').value
  createFile(fileName)
  dialogCancel()
}

elementDialogCancel.onclick = event => {
  event.preventDefault()
  dialogCancel()
}

reloadFileList()
