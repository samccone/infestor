module.exports = function(opts) {
  var minimatch = require("minimatch");
  opts = opts || {};
  opts.injectAt = opts.injectAt || /<\/html>$/;
  opts.files = opts.files || [ "**/*.html", "/" ];
  opts.content = opts.content || "<h2>hello world</h2>";
  opts.injectContent = opts.injectContent || injectContent;

  return function(req, res, next) {
    var match = false;
    for (var index = 0; index < opts.files.length; index++) {
        var file = opts.files[index];
        if (minimatch(req.url, file)) {
            match = true;
        }
    }
    if (!(match)) {
        return next();
    }
    var write     = res.write,
        end       = res.end,
        content   = [],
        writeEncoding;

    /**
     * Intercepts the write function and pushes any content to a store. Also
     * stores the encoding, assuming that nobody is crazy enough to push a bunch
     * of different content chunks all with different encodings.
     *
     * @param  {String|Buffer} chunk - a chunk of the response body
     * @param  {String} encoding - how to decode, if chunk is a buffer
     */
    res.write = function(chunk, encoding) {
      res.write = write;
      writeEncoding = encoding;
      content.push(chunk);
    };

    /**
     * Intercepts res.end to inject content if applicable according
     * to the implementation details of `injectContent`.
     *
     * @param {String} data     [the data arg passed to res.end]
     * @param {String} encoding [the encoding that response will be returned with]
    **/
    res.end = function(data, encoding) {
      res.end = end;
      var injectedData = opts.injectContent.apply(this, [content, writeEncoding].concat([].slice.call(arguments, 0)), data, encoding);
      if (!res.headersSent) {
        res.setHeader('content-length', Buffer.byteLength(injectedData, encoding));
      }
      return res.end(
        injectedData,
        encoding
      );
    };

    next();
  }

  /**
   * The default implementation of inject content. This implementation should
   * be fine for most people usin this tool, however it can be easily overidden
   * via the `injectContent` option.
   * The logic for this method is as follows:
   * First, we format and
   * join any content that was written with res.write. If that's not present,
   * we use the data argument passed to res.end. If this is a string, we
   * continue on, if not, we simply return data -- it has no content,
   * so we won't be injecting anything. Assuming we do have some content,
   * based on whether our matcher matches the response body string, we inject
   * content at the preferred injection point. Finally, we call res.end with
   * our newly (possibly) injected content.
   * @param {String} content [the content of the response]
   * @param {String} writeEncoding
   * @param {data}
   * @param {encoding}
  **/
  function injectContent(content, writeEncoding, data, encoding) {
    var str = content.map(function(b) {
      return b.toString(writeEncoding);
    }).join('');

    if (str === '') {
      if (!data) {
        return data;
      }

      str = data.toString(encoding)
    }

    if (opts.append) {
      str += opts.content;
    } else if (str.match(opts.injectAt)) {
      str = str.replace(opts.injectAt, function(w) {
        return opts.content + w;
      });
    }

    return str;
  }
};
