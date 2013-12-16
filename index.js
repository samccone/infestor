module.exports = function(opts) {
  opts = opts || {};
  opts.injectAt = opts.injectAt || /<\/html>/;
  opts.content = opts.content || "<h2>hello world</h2>";

  return function(req, res, next) {
    var w         = res.write;
    var e         = res.end;
    var injected  = false;

    res.write = function(buffer, encoding) {
      var string, _ref;
      res.write = w;

      // validate that the document is HTML short circut if not
      if (!((buffer != null) && ~((_ref = req.headers["accept"]) != null ? _ref.indexOf('html') : void 0))) {
        return;
      }

      string = buffer.toString(encoding);

      // if we have an html tag inject the content
      if (~string.indexOf('<html>')) {
        injectLocalScript(string, encoding, res);
        return injected = true;
      }

      return res.write(buffer, encoding);
    };

    res.end = function(string, encoding) {
      res.end = e;

      // if we have injected update the content length of the response
      if (injected) {
        res.setHeader('content-length', Buffer.byteLength(res.data, encoding));
      }
      return res.end(res.data, encoding);
    };

    // continue down the chain
    next();
  }

  function injectLocalScript (string, encoding, res) {
    return res.data = (res.data || '') + string.replace(opts.injectAt, function(w) {
      return opts.content + w;
    });
  }
};