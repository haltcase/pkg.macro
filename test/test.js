const test = require("ava")

const { transformAsync } = require("@babel/core")
const macros = require("babel-plugin-macros")
const dedent = require("dedent")

const rewriteImports = require("./helpers/plugin-rewrite-imports")

const transform = async input =>
  (await transformAsync(dedent(input.trim()), {
    babelrc: false,
    filename: __filename,
    plugins: [rewriteImports("pkg.macro"), macros]
  })).code

test("does the thing", async t => {
  const input = dedent`
    const pkg = require("pkg.macro")
    const { name, license, scripts } = pkg(["name", "license", "scripts.test"])
  `

  t.is(await transform(input), dedent`
    const {
      name,
      license,
      scripts
    } = {
      "name": "pkg.macro",
      "license": "MIT",
      "scripts": {
        "test": "ava"
      }
    };
  `)
})
