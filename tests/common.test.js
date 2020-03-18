const chai = require('chai')
const path = require('path')
const fs = require('fs')
const expect = chai.expect
const { saveFile, saveHistoryFile } = require('../src/common/common')

describe('Unit Test `common.js`', function() {
  this.timeout(15000)

  it('Should `saveFile` callback on success', (done) => {
    global.sharedObject = {
      dirInfo: {
        basePath: __dirname
      }
    }
    saveFile('_test.file', 'testString', () => {
      expect(true).to.be.true
      fs.unlinkSync(path.join(__dirname, '_test.file'))
      done()
    })
  })

  it('Should `saveHistoryFile` create the right json file', () => {
    const jsonFile = path.join(__dirname, '_test.json')
    fs.writeFileSync(jsonFile, '["test1"]')
    saveHistoryFile(jsonFile, 'test2', () => {
      const json = fs.readFileSync(jsonFile)
      const data = JSON.parse(json)
      expect(data.length).to.equal(2)
      expect(data[0]).to.equal('test2')
      expect(data[1]).to.equal('test1')
      fs.unlinkSync(jsonFile)
    })
  })
})
