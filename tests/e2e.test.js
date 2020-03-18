const chai = require('chai')
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect

global.before(function () {
  chai.should();
  chai.use(chaiAsPromised);
});

const Application = require('spectron').Application
const app = new Application({
  path: '/home/alex/dev/learn/electronDemo/native/dist/linux-unpacked/native-test'
})

describe('End To End Test', function() {
  this.timeout(15000)
  before(function () {
    chaiAsPromised.transferPromiseness = app.transferPromiseness;
    return app.start()
  });

  after(function () {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  it('Only one window can be loaded', (done) => {
    app.client.waitUntilWindowLoaded().getWindowCount().then(count => {
      expect(count).to.equal(1)
      done()
    })
  })

  it('Window should be visitable', () => {
    expect(app.browserWindow.isVisible()).to.be.ok
  })

  it ('Should get a title', async () => {
    const title = await app.client.getTitle()
    expect(title).to.equal('Electron 编辑器（Demo）')
  })

  it("Should show history list visiblity", async () => {
    const visible = await app.client.element('.history-list').element('li').isVisible()
    expect(visible).to.be.true
  })

})
