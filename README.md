# swcaller
call a function in service worker

# Example
in `index.js`
```js
  const swcaller = require('swcaller/index.js')
  await navigator.serviceWorker.register('/sw.js',{ scope: '/' })
  await swcaller.call({ type: 'hello', name: 'alan turing' })
```

in service worker file `sw.js`

```js
self.addEventListener('message', function(event) {
  if (event.data.type == 'hello') {
  var port = event.ports && event.ports[0]
  if (!port) return
  port.postMessage('hello' + event.data.name);
})
```
