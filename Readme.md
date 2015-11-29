# future-node

Actually though it doesn't _give_ you future syntax automatically, it just enables modules to specify their transpilers. It does this by replacing node's built in system of extension hooks with a better system inspired by browserify. So a more accurate name for this project would be transpiler-friendly-node since its not really opinionated about your transpiler. It does come bundled with a ES2016 transpiler though for convenience since this will be its most common usage.

## Installation

`npm install future-node`

then in your app:

```js
require('future-node')
```

Or install it globally an run like

```sh
future-node my-app
```

## Specifying transpilers

Transpilers are specified in your `package.json`

```json
{
  "dependencies": {
    "some-module-that-exports-a-function": "1",
    "a-lisp-to-js-thing": "1"
  },
  "transpile": [
    ["*.js", "some-module-that-exports-a-function", {"options": true}],
    ["*.lisp", "a-lisp-to-js-thing"]
  ]
}
```

Hopefully it explains itself. To use the built in ES2016 transpiler

```json
{
  "transpile": [
    ["*.js", "!sourcegraph/babel->js", {"stage": 0}]
  ]
}
```

Weird I know. It's just so as to be compatable with my browser build bundler. You can safely ignore it if you like.
