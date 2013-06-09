var indent = function (code) {
  var lines = code.split("\n")
  var state = {lines: lines, code: code, indent_count: 0, expr_stack: [], expr: [], indent_stack: []}

    //geraldine  joaquine  

  var parse_line = function (line, indent_count) {
    //return line.substr(indent_count).split(/ +/) // for now, soon parse parens and simple dash based multi line strings 
   
    return parens(line.substr(indent_count))
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
    state.last_line = parse_line(line, indent_count)
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

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = indent;
  }
}

//console.log(parens("say test\nother say"))
//console.log(parens("say test\nother say\n  yo world\n  yo stuff"))
//console.log(parens("say test\nother say\n  yo world\n  yo stuff\nok"))
//console.log(parens("say test\nother say\n  stuff here too\n  and here\n    but here\nback bere"))
//console.log(parens("say test\nother say\n  stuff here too\n  and here\n    but here\n  also here\nback bere"))
//
console.log(indent("say test\nother say\n  yo world\n    here too\n  yo stuff"))
//console.log(parens("say test\nother say\n  yo world\n    here too"))

/*

  mystirng = ###
    this is a multi line string
    is has

*/
