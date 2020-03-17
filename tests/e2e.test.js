const chai = require('chai')
const path = require('path')
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect
const should = chai.should()
chai.use(chaiAsPromised);
const Application = require('spectron').Application

const app = new Application({
  path: '/home/alex/dev/learn/electronDemo/native/dist/linux-unpacked/native-test'
})

describe('End To End Test', () => {
  before(function () {
    chaiAsPromised.transferPromiseness = app.transferPromiseness;
    return app.start();
  });

  after(function () {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  it('Only one window can be loaded', () => {
    app.client.waitUntilWindowLoaded().getWindowCount().then(count => {
      expect(count).to.equal(1)
    })
  })

  it('Window should be visitable', () => {
    expect(app.browserWindow.isVisible()).to.be.ok
  })

  it ('Should get a title', async () => {
    const title = await app.client.getTitle()
    expect(title).to.equal('Electron 编辑器（Demo）')
  })

  it("Should show dialog", async () => {
    const visible = await app.client.element('.history-list').element('li').isVisible()
    expect(visible).to.be.true
  })

})
