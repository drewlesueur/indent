var parens = function (code) {
  var lines = code.split("\n")
  var state = {lines: lines, code: code, indent_count: 0, expr_stack: [], expr: [], indent_stack: [0]}
  var parse_line = function (line) {
    return line.split(/ +/) // for now, soon parse parens and simple dash based multi line strings
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
      indent_count += state.indent_stack.pop()
      var new_expr = state.expr
      var popped_expr = state.expr_stack.pop()
      var last_popped_expr = popped_expr[popped_expr.length - 1]
      last_popped_expr.splice.apply(last_popped_expr, [last_popped_expr.length, 0,].concat(new_expr))
      state.expr = popped_expr
    }
    return state;
  }

  var step = function (state) {
    var line = state.lines[i];
    var indent_count = get_indent_count(line)
    if (indent_count > state.indent_count) {
      state.expr_stack.push(state.expr) 
      state.expr = []
      state.indent_stack.push(indent_count)
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
console.log(parens("say test\nother say\n  stuff here too\n  and here\n    but here\nback bere"))

