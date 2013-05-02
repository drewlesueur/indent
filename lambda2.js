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
