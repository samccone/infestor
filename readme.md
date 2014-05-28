# Infestor

[![npm](http://img.shields.io/npm/v/infestor.svg?style=flat)](https://badge.fury.io/js/infestor)
[![tests](http://img.shields.io/travis/samccone/infestor/master.svg?style=flat)](https://travis-ci.org/samccone/infestor)
[![coverage](http://img.shields.io/coveralls/samccone/infestor.svg?style=flat)](https://coveralls.io/r/samccone/infestor)

Inject content into your server responses

### Why should you care?

There are times when all you want to do is inject a JS file or custom markup into the req res cycle without forcing the content generator to include custom markup on their side.

This is where infestor comes in. Just specify the regex insertion point and content. Then you are good to go.

### Installation

`npm install infestor --save`

### Infestor Options
* `content`: A string of content to be injected into the response
* `injectAt`: The location where your content will be inject at.
* `append`: A boolean representing if your custom content should just be appended to the response (overrides `injectAt`).
* `injectContent`: An overrideable method to define how your content is inserted into the response. It is naive to think that infestor can cover all of the use cases for everyone. So instead of bloating the core injection method, we provide a simple to use hook into the primary buisness logic for inserting custom content.

### Usage

```js
var http = require('http');
    connect = require('connect'),
    infestor = require('infestor'),
    serveStatic  = require('serve-static');

var app = connect()
            .use(infestor({
              content: "<h2> injected content! </h2>",
              injectAt: '/<\/html>/'
            })
            .use(serveStatic(__dirname));

var server = http.createServer(app).listen(1111)
```

Make sure that you place the infestor middleware before you serve your content or else infestor will not work.


### License & Contributing

- Details on the license [can be found here](LICENSE.md)
- Details on running tests and contributing [can be found here](contributing.md)

-----------

![](http://media.moddb.com/images/mods/1/10/9329/63165.jpg)
