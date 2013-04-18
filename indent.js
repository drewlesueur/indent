var parens = function (code) {
  var lines = code.split("\n")
  var state = {lines: lines, code: code, indent_count: 0, expr_stack: [], expr: [], indent_stack: []}
  var escaped_words = {
    n: "\n"
    
  }
  var get_escaped_word = function (word) {
    if (word in escaped_words) {
      return escaped_words[word]
    } else {
      return word
    }
    // todo: \xabcd
  }

  //get_expected_word ; word
    //geraldine  joaquine  

  var parse_line = function (line) {
    return line.split(/ +/) // for now, soon parse parens and simple dash based multi line strings
    var line_state = {
      i: 0,
      line: line,
      expr_stack: [],
      expr: [],
      word: "",
      state: "normal",
      backslash_word: ""
    }
    // sq - "
    var step_line = function (line_state) {
      var chr = line.substr(line_state.i)
 
     if (line_state.state == "normal") {
        if (chr == "(") {
          line_state.expr_stack.push(line_state.expr)
          line_state.expr = []
        } else if (chr == ")") {
          var expr = line_state.expr
          line_state.expr = line_state.expr_stack.pop()
          line_state.expr.push(expr)
          
        } else if (chr == " "){
          line_state.expr.push(state.word)
          line_state.word = ""
        } else if (chr == "\""){
          line_state.state = "quote"
        } else {
          line_state.word = line_state.word + chr
        }
      } else if (state == "quote") {
        if (chr == "\\") {
          line_state.state = "backslash"
        } else if (chr == "\"") {
          line_state.state = "normal"
        } else {
          line_state.word = line_state.word + chr
        }
      } else if (line_state.state == "backslash") {
        if (chr == " ") {
          line_state.word += get_escaped_word(line_state.backslash_word)
          line_state.word += chr
          line_state.backslash_word = ""
          line_state.state = "quote"
        } else if (chr == "\\") {
           line_state.word += get_escaped_word(line_state.backslash_word)
           line_state.backslash_word = ""
        }
      }
    }
    
    var line_i = 0
    while (line_i < line.length) {
      line_state.i = line_i
      line_state = step_line(line_state)
    }
    
    return line_state.expr
  
  }

	var get_indent_count = function (line) {
		var ic = 0
		var line_len = line.length
		while (ic < line_len) {
			if (line.substr(ic,1) == " ") { ic++ } else { break }
		}
		return ic
	}

  pop_expr = function (indent_count, state) {
    while (indent_count < state.indent_count) {
      state.expr = state.expr_stack.pop()
      state.indent_count = state.indent_stack.pop()
    }
    return state;
  }

  var step = function (state) {
    var line = state.lines[i];
    var indent_count = get_indent_count(line)
    if (indent_count > state.indent_count) {
      state.expr_stack.push(state.expr) 
      state.expr = state.expr[state.expr.length - 1]
      //state.expr = [] //alternate way 1
      state.indent_stack.push(state.indent_count)
      state.indent_count = indent_count
    } else {
      state = pop_expr(indent_count, state)
    }
    state.last_line = parse_line(line)
    state.expr.push(state.last_line)
    state.indent_count = indent_count
    return state;
  }

  for (var i = 0; i < lines.length; i++) {
    state.i = i
    state = step(state) 
  }

  state = pop_expr(0, state)

  return state.expr
}


//console.log(parens("say test\nother say"))
//console.log(parens("say test\nother say\n  yo world\n  yo stuff"))
//console.log(parens("say test\nother say\n  yo world\n  yo stuff\nok"))
//console.log(parens("say test\nother say\n  stuff here too\n  and here\n    but here\nback bere"))
//console.log(parens("say test\nother say\n  stuff here too\n  and here\n    but here\n  also here\nback bere"))
//
console.log(parens("say test\nother say\n  yo world\n    here too\n  yo stuff"))
//console.log(parens("say test\nother say\n  yo world\n    here too"))


