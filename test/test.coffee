getInjectedContent  = require './_helpers'
assert              = require 'assert'

describe 'content injection', ->
  afterEach (done) -> getInjectedContent.close done

  it "should inject default content", (done) ->
    getInjectedContent {}, (b) ->
      done(
        assert.equal(b.replace(/\s/g,""), '<html><body><h2>hi</h2></body><h2>helloworld</h2></html>')
      )

  it "should inject custom content", (done) ->
    getInjectedContent {content: "noo"}, (b) ->
      done (
        assert.equal(b.replace(/\s/g,""), '<html><body><h2>hi</h2></body>noo</html>')
      )

  it "should inject custom content into the correct place", (done) ->
    getInjectedContent {content: "noo", injectAt: /<body>/}, (b) ->
      done(
        assert.equal(b.replace(/\s/g,""), '<html>noo<body><h2>hi</h2></body></html>')
      )

  it "should inject custom content at the start with append", (done) ->
    getInjectedContent {content: "wow", append: true}, (b) ->
      done(
        assert.equal(b.replace(/\s/g,""), '<html><body><h2>hi</h2></body></html>wow')
      )

  it "should allow for overriding the default implementation of injectContent", (done) ->
    getInjectedContent {injectContent: -> "NO"}, (b) ->
      done(
        assert.equal(b, 'NO')
      )
