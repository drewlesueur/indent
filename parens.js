var parens = function (code, linked_list) {

  var is_array = function (a) {
    return Object.prototype.toString.call(a) === '[object Array]'
  }
  var to_linked_list = function (list, index) {
    index = index || 0
    var item = list[index]
    if (is_array(item)) {
      item = to_linked_list(item, 0)
    }

    if (index + 1 >= list.length) {
      return [item];
    } else {
      var next = to_linked_list(list, index + 1)
      if (next.length == 1) { next = next[0] }
      return [item, next] 
    }
  }

  var i = 0
  var state = {chr: "", word: "", stack: [], expr: [], mode: "normal", string_parens: 0}
  var string_symbol = "$"; //this could change
  var close_word = function (state) {
    if (state.word.length) {
      state.expr.push(state.word)
      state.word = ""
    }
    return state;
  }
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
        state = close_word(state)
        var expr = state.expr
        state.expr = state.stack.pop()
        state.expr.push(expr)
      } else if (chr == " ") {
        state = close_word(state)
      } else {
        state.word += chr
      }
    } else if (state.mode == "string") {
      if (chr == "(") {
        state.string_parens += 1
      } else if (chr == ")") {
        state.string_parens -= 1
        if (state.string_parens < 0) {

          state.expr = state.stack.pop()
          state.expr.push("\"" + JSON.parse("\"" + state.word + "\"") + "\"")

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
  
  if (linked_list) {
    return to_linked_list(state.expr)
  } else {
    return state.expr
  }  
}


console.log(JSON.stringify(parens("hello world", true)))
console.log(JSON.stringify(parens("(hello worldi)")))
console.log(JSON.stringify(parens("(hello (this is a) (cool message (what ever)))")))
console.log(JSON.stringify(parens("(hello (this is a) (cool message (what ever)))", true)))
//console.log(JSON.stringify(parens("(name $(My name is drew lesueur))")))
