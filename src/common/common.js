const path = require('path')
const { format } = require('url')
var gfs = require('graceful-fs')

function pathToUrl(...paths) {
  return format({
    pathname: path.join(...paths),
    protocol: 'file',
    slashes: true
  })
}

function saveHistoryFile(storePath, dirPath, callback = null) {
  return gfs.readFile(storePath, (err, data) => {
    if (err) {
      throw err
    }
    const json = JSON.parse(data).filter(d => d !== dirPath)
    gfs.writeFile(storePath, JSON.stringify([
      dirPath,
      ...json
    ].slice(0, 6)), () => {
      if (callback) {
        callback()
      }
    })
  })
}

function saveFile(fileName, content, callback) {
  const { dirInfo } = global.sharedObject
  if (null !== fileName) {
    const localPath = path.join(dirInfo.basePath, fileName)
    gfs.writeFile(localPath, content, err => {
      if (!err) {
        callback()
      }
    })
  }
}

module.exports = {
  pathToUrl,
  saveHistoryFile,
  saveFile
}
