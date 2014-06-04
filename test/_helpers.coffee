port        = process.env['port'] || 4521
connect     = require 'connect'
request     = require 'request'
infestor    = require '../index.js'
serveStatic = require 'serve-static'
basePath    = "http://localhost:#{port}/"
http        = require 'http'
server      = null

startServer = (opts, cb) ->
  app     = connect()
  app.use(infestor(opts)).use(serveStatic("#{__dirname}/public"))
  server = http.createServer(app)
  server.listen port, cb

getInjectedContent = (opts, cb) ->
  opts.file ||= "index.html"
  startServer opts, =>
    request.get basePath+opts.file, (e, r, b) -> cb(b)

module.exports       = getInjectedContent
module.exports.close = (cb) -> server.close(cb)
