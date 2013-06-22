var parens = function (code) {

  var is_array = function (a) {
    return Object.prototype.toString.call(a) === '[object Array]'
  }

  var i = 0
  var state = {chr: "", word: "", stack: [], expr: []}
  var close_word = function (state) {
    if (state.word.length) {
      state.expr.push((state.word))
      state.word = ""
    }
    return state;
  }
  var step = function (state) {
    var chr = state.chr
    if (chr == "(") {
      state.stack.push(state.expr)
      state.expr = []
    } else if (chr == ")" && state.stack.length) {
      state = close_word(state)
      var expr = state.expr
      state.expr = state.stack.pop()
      state.expr.push(expr)
    } else if (chr == " ") {
      state = close_word(state)
    } else {
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
