import { dirname } from "path"
import { readFileSync } from "fs"

import { createMacro } from "babel-plugin-macros"
import { parseExpression } from "@babel/parser"
import { sync } from "find-up"
import pickDeep from "pick-deep"

import { NodePath } from "@babel/core"
import { ArrayExpression } from "@babel/types"

class PkgMacroError extends Error {
  constructor (message: string) {
    super(message)
    this.name = "PkgMacroError"
    this.stack = ""
  }
}

const throwFrameError = (path: NodePath<any>, msg: string): never => {
  throw path.buildCodeFrameError(`\n\n${msg}\n\n`, PkgMacroError)
}

const getKeyPaths = (path: NodePath<ArrayExpression>) =>
  path.get("elements").reduce((final, element) => {
    if (element.isStringLiteral()) {
      return [...final, element.node.value]
    }

    if (element.isArrayExpression()) {
      const values = element.get("elements").map(path => {
        if (!path.isStringLiteral()) {
          return throwFrameError(path, "pkg.macro: expected key in path to be of type `string`")
        }

        return path.node.value
      })

      return [...final, values]
    }

    return throwFrameError(element, "pkg.macro: expected path to be of type `string | string[]`")
  }, [] as Array<string | string[]>)

export default createMacro(({ references, state }) => {
  const { filename } = state.file.opts
  const cwd = dirname(filename)

  for (const reference of references.default) {
    const { parentPath } = reference
    if (!parentPath.isCallExpression()) {
      return throwFrameError(parentPath, "pkg.macro must be used as a function call")
    }

    const [pathArray, ...rest] = parentPath.get("arguments")

    if (!pathArray || rest.length > 0 || !pathArray.isArrayExpression()) {
      return throwFrameError(reference, "pkg.macro: expected a single array argument")
    }

    const pkgPath = sync("package.json", { cwd })

    if (!pkgPath) {
      return throwFrameError(reference, "pkg.macro could not resolve a package.json from " + cwd)
    }

    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"))
    const subset = pickDeep(pkg, getKeyPaths(pathArray))
    const result = parseExpression(JSON.stringify(subset))

    return parentPath.replaceWith(result)
  }
})
