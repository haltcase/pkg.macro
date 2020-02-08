# pkg.macro &middot; [![Version](https://flat.badgen.net/npm/v/pkg.macro)](https://www.npmjs.com/package/pkg.macro) [![License](https://flat.badgen.net/npm/license/pkg.macro)](https://www.npmjs.com/package/pkg.macro) [![JavaScript Standard Style](https://flat.badgen.net/badge/code%20style/standard/green)](https://standardjs.com)

> Fetch properties of your project's `package.json` at compile time.

pkg.macro allows you to turn `pkg(["name", "version"])` into
`{ name: "your-package", version: "1.0.0" }` as a build time constant.

## installation

```sh
yarn add --dev pkg.macro
```

Make sure you also have [Babel][babel] and [babel-plugin-macros][babel-plugin-macros]
installed:

```sh
yarn add --dev @babel/cli @babel/core babel-plugin-macros
```

... and configured with Babel:

```js
module.exports = {
  presets: [],
  plugins: ["babel-plugin-macros"]
}
```

## usage

```js
import pkg from "pkg.macro"

const props = pkg([
  "name",
  "version",
  "scripts.test",
  ["dependencies", "some-package"]
])
```

The above is transformed to:

```js
const props = {
  name: "your-package",
  version: "1.0.0",
  scripts: {
    test: "test-script"
  },
  dependencies: {
    "some-package": "1.0.0"
  }
}
```

## see also

* [param.macro][param.macro] &ndash; macro for partial application, inspired by Scala's `_` & Kotlin's `it`

## development

1. Clone the repo: `git clone https://github.com/citycide/pkg.macro.git`
2. Move into the new directory: `cd pkg.macro`
3. Install dependencies: `yarn` or `npm install`
4. Build the source: `yarn build` or `npm run build`
5. Run tests: `yarn test` or `npm test`

## contributing

Pull requests and any [issues](https://github.com/citycide/pkg.macro/issues)
found are always welcome.

1. Fork the project, and preferably create a branch named something like `feat-make-better`
2. Follow the build steps [above](#development) but using your forked repo
3. Modify the source files in the `src` directory as needed
4. Make sure all tests continue to pass, and it never hurts to have more tests
5. Push & pull request! :tada:

## license

MIT © [Bo Lingen / citycide](https://github.com/citycide)

[babel]: https://babeljs.io
[babel-plugin-macros]: https://github.com/kentcdodds/babel-plugin-macros
[param.macro]: https://github.com/citycide/param.macro
