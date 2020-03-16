const path = require('path')
const { format } = require('url')

function pathToUrl(...paths) {
  return format({
    pathname: path.join(...paths),
    protocol: 'file',
    slashes: true
  })
}

module.exports = {
  pathToUrl
}
