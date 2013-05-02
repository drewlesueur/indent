var parens = function (code, linked_list) {

  var is_array = function (a) {
    return Object.prototype.toString.call(a) === '[object Array]'
  }
  var to_linked_list = function (list, index) {
    index = index || 0
    if (index >= list.length) {
      return [];
    }
    var item = list[index]
    if (is_array(item)) {
      item = to_linked_list(item, 0)
    }
    return [item, to_linked_list(list, index + 1)] 
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
var indent = function (code) {
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
console.log(indent("say test\nother say\n  yo world\n    here too\n  yo stuff"))
//console.log(parens("say test\nother say\n  yo world\n    here too"))


var lambda = function (raw_code) {
	var is_array = function (a) {
		return Object.prototype.toString.call(a) === '[object Array]'
	}

  var code = parens(raw_code, true)
  code = code[0] //dewrap the first parens, for now.
  console.log("the code is " + code)
  // soon yoy should make the other ones macros

  var state = {
    code: code,
    code_stack: [],
    index: 0,
    value: null
  }

  var call = function (x, y) {
    return "(" + x + "," + y + ")"
  }

  var step = function (state) {
    if (is_array(state.code)) {
       state.value = call(state.code[0], state.code[1]) 
    } else {
      console.log("SETTING THE VALUE to " + state.code)
      state.value = state.code;
      state.code = state.code_stack.pop() 
    }
    return state;
  }

  for (var i = 0; i < 1000; i++) {
    state = step(state)
    if (state.code === undefined) {
      break;
    }
  }

  return state.value
}  

// (x y)
var assert = require("assert")

var e = function (a, b, c) { assert.equal(a, b, c) }
var de = function (a, b, c) { 
  try {
    assert.deepEqual(a, b, c) 
  } catch (e) {
    console.log(e)
    console.log("Actual..")
    console.log(JSON.stringify(e.actual))
    process.exit(1)
  }
}


de(parens("hello world"), ["hello","world"], "test simple parens")
de(parens("(hello world)"), [["hello","world"]], "test simple parens 2")
de(parens("(hello world (some cool) things ((in here) yo))"), [["hello","world",["some","cool"],"things",[["in","here"],"yo"]]] , "test simple parens 2")

de(parens("hello world", true), ["hello",["world",[]]], "test simple parens linked list")
de(parens("(hello world (some cool) things ((in here) yo))", true), 
		[["hello",["world",[["some",["cool",[]]],["things",[[["in",["here",[]]],["yo",[]]],[]]]]]],[]] ,
		"test simple parens 2")

de(parens("(-x x) 20", true), [["-x",["x",[]]],["20",[]]],  "lambda")
de(parens("-x x 20", true), ["-x",["x",["20",[]]]],  "lambda")
de(parens("-x -y -z (x y z) true Drew Aimee", true),
["-x",["-y",["-z",[["x",["y",["z",[]]]],["true",["Drew",["Aimee",[]]]]]]]]		
, "true false")// -x -y -z (x y z) true Drew Aimee

de(lambda("x"), "x", "simplest lambda")

//should these be the same thing?
//parens dont nec. mean function call?
//lambda("-x x 20")
//lambda("-x (x) 20")
//lambda("(-x x) 20")
//lambda("(-x x 20)")
//
// -x -y -z (x y z) true Drew Aimee

// fn x fn y fn z (x y z) true Drew Aimee
// K -x -y x
// I -x x
// KI -y -x x





//de(false, true)

