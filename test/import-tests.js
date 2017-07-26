import assert from "assert"

describe("import declarations", () => {
  it("should cope with dependency cycles", () =>
    Promise.all([
      import("./import/cycle-a.js"),
      import("./import/cycle-a.js")
    ])
    .then((namespaces) => namespaces.forEach((ns) => ns.check()))
    .catch((e) => assert.ifError(e))
  )

  it("should support combinations of import styles", () =>
    import("./import/combinations.js")
      .then((ns) => ns.check())
      .catch((e) => assert.ifError(e))
  )

  it("should support same symbol as different locals", () =>
    import("./import/locals.js")
      .then((ns) => ns.check())
      .catch((e) => assert.ifError(e))
  )

  it("should support CJS modules setting module.exports", () =>
    import("./import/cjs.js")
      .then((ns) => ns.check())
      .catch((e) => assert.ifError(e))
  )

  it("should support import extensions", () =>
    import("./import/extension.js")
      .then((ns) => ns.check())
      .catch((e) => assert.ifError(e))
  )
})
