var parens = function (code) {
  var i = 0
  var state = {chr: "", word: "", stack: [], expr: [], mode: "normal", string_parens: 0}
  var string_symbol = "$"; //this could change
  var step = function (state) {
    var chr = state.chr
    if (state.mode == "normal") {
      if (chr == "(") {
        state.stack.push(state.expr)
        state.expr = []
        if (state.word == string_symbol) {
          state.word = "";
          state.mode = "string";
          state.string_parens = 0
        }
      } else if (chr == ")") {
        var expr = state.expr
        state.expr = state.stack.pop()
        state.expr.push(expr)
      } else if (chr == " ") {
        if (state.word.length) {
          state.expr.push(state.word)
          state.word = ""
        }
      } else {
        state.word += chr
      }
    } else if (state.mode == "string") {
      if (chr == "(") {
        state.string_parens += 1
      } else if (chr == ")") {
        state.string_parens -= 1
        if (state.string_parens < 0) {
          state.expr.push(state.word)
          state.word = ""
          state.mode = "normal"
          return state;
        }
      }
      state.word += chr
    }
    return state;
  }

  while (i < code.length) {
    state.chr = code[i]
    state = step(state)
    i += 1
  }
  state.chr = " "
  state = step(state)
  
  return state.expr
}


console.log(parens("hello world"))
console.log(parens("(hello world)"))
console.log(parens("(hello (this is a) (cool message (what ever)))"))
console.log(parens("(name $(My name is drew lesueur))"))
