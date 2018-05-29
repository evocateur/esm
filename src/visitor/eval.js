import Visitor from "../visitor.js"

import isIdentifier from "../parse/is-identifier.js"
import overwrite from "../parse/overwrite.js"
import shared from "../shared.js"

function init() {
  class EvalVisitor extends Visitor {
    reset(rootPath, options) {
      this.magicString = options.magicString
      this.possibleIndexes = options.possibleIndexes
      this.runtimeName = options.runtimeName
      this.strict = options.strict
    }

    visitIdentifier(path) {
      const node = path.getValue()

      if (node.name !== "eval") {
        return
      }

      const parent = path.getParentNode()
      const { type } = parent

      if (type === "CallExpression" ||
          (type === "AssignmentExpression" &&
           parent.left === node) ||
          ! isIdentifier(node, parent)) {
        return
      }

      // Support indirect eval:
      // o = { eval }
      // o.e = eval
      // (0, eval)(code)
      this.changed = true

      const { runtimeName } = this

      let code = runtimeName + ".g"

      if (! this.strict) {
        code = "(eval===" + runtimeName + ".v?" + code + ":eval)"
      }

      if (type === "Property" &&
          parent.shorthand) {
        this.magicString.prependLeft(node.end, ":" + code)
      } else {
        overwrite(this, node.start, node.end, code)
      }
    }
  }

  return new EvalVisitor
}

export default shared.inited
  ? shared.module.visitorEval
  : shared.module.visitorEval = init()