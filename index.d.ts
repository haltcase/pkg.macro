export type JsonObject = { [key: string]: JsonValue }

export interface JsonArray extends Array<JsonValue> {}

export type JsonValue = string | number | boolean | null | JsonObject | JsonArray

interface PkgMacro {
  <R = JsonValue> (...keyPaths: readonly string[]): Record<string, R>
}

declare const pkg: PkgMacro

export = pkg
