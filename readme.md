Injector
---------
[![Build Status](https://travis-ci.org/[samccone]/[injector].png)](https://travis-ci.org/[samccone]/[injector])


Inject content into your server responses


### Why?
There are times when all you want to do is inject a JS file or custom markup into the req res cycle without forcing the content generator to include custom markup on their side.

This is where injector comes in. Just specify the regex insertion point and content. Then you are good to go.

### How to

```coffeescript
  app.use injector
    content: "<h2> injected content! </h2>"
    injectAt: '/<\/html>/'
```