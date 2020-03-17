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

function loadDir(dir) {
  var children = []
  gfs.readdirSync(dir).forEach(function(filename){
    var path = dir+"/"+filename
    var stat = gfs.statSync(path)
    if (stat && stat.isDirectory()) {
      children = children.concat(loadDir(path))
    }
    else {
      children.push(path)
    }
  })
 
    return children
}

function saveHistoryFile(storePath, dirPath) {
  gfs.readFile(storePath, (err, data) => {
    if (err) {
      throw err
    }
    const json = JSON.parse(data).filter(d => d !== dirPath)
    gfs.writeFile(storePath, JSON.stringify([
      dirPath,
      ...json
    ].slice(0, 6)))
  })
}

function saveFile(content, callback) {
  const { dirInfo } = global.sharedObject
  if (null !== dirInfo.currentFile) {
    const localPath = path.join(dirInfo.basePath, dirInfo.currentFile)
    gfs.writeFile(localPath, content, err => {
      if (!err) {
        callback()
      }
    })
  }
}

module.exports = {
  pathToUrl,
  loadDir,
  saveHistoryFile,
  saveFile
}
