const { join } = require("path")

const originalImportSource = "pkg.macro"
const rewrittenImportSource = "./test/helpers/macro"

const unixPath = path =>
  path.replace(/\\/g, "/")

const macroSource = unixPath(join(process.cwd(), rewrittenImportSource))

const isTargetSource = path =>
  path.isStringLiteral({ value: originalImportSource })

const isCalleeRequire = path =>
  path.get("callee").isIdentifier({ name: "require" })

const transformImport = (path, targetSource) => {
  const source = path.get("source")
  if (isTargetSource(source, targetSource)) {
    source.node.value = macroSource
  }
}

const transformCallExpression = (path, targetSource) => {
  const arg = path.get("arguments.0")
  if (!!arg && isCalleeRequire(path) && isTargetSource(arg, targetSource)) {
    arg.node.value = macroSource
  }
}

module.exports = targetSource => () => ({
  visitor: {
    // using `Program` visitor so we can transform before other plugins
    Program (path) {
      path.get("body").forEach(p => {
        if (p.isImportDeclaration()) {
          transformImport(p, targetSource)
        } else if (p.isVariableDeclaration()) {
          const init = p.get("declarations.0.init")
          if (init.isCallExpression()) {
            transformCallExpression(init, targetSource)
          }
        }
      })
    }
  }
})
