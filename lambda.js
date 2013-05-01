// parens don't nec. mean function call
var lambda_compile = function (raw_code) {
  // lambda parens doesn't mean call a funciton
  // passing a parameter does?
	//
	// Interesting the difference between funciton definition and function application.
	// (in my own implementation, I am kind of trying to make function definition like function application. In its own way)
	
	var is_array = function (a) {
		return Object.prototype.toString.call(a) === '[object Array]'
	}

	var is_function_create = function (expr) {
		return expr.substr(0, 1) == "-"
	}

	var function_creator = function (argument_name) {
		return {
			type: "function_creator",
			argument_name: argument_name
		}
	}
	
	// todo: first cache all the names
  code = parens(raw_code, true) 
	var the_left = null;
	var state = {
		code: code,
		i: 0,
		//stack: [] // ok, trying to not use the stack for this thing
		// not that it's bad (i'm using it in parens.) Just trying 
		// a different way. Might be better
		parent: null

	}

	var step_eval = function (state) {
		if (is_array(state.code)) {
			return {
				code: code[state.i],
				parent: state
			}	
		} else {
			
		}
	}

	for (var i = 0; i < 1000; i++) {
	// while (true) {
		state = step_eval(state)
	}		
}



/*
var I = (function () {
  var arg = {
    value: "tmp_value",
    type: "arg"
  }
  return {
    arg: arg,
    body: [arg],
    type: "lambda"
  }
})()

var K = (function () {
  var arg = {
    value: "tmp_value",
    type: "arg"
  }
  return {
    arg: arg,
    body: [],
    type: "lambda"
  }
})
*/

//console.log(lambda_compile("(-x x) 1"))
//console.log(lambda_compile("(-x x) $(yo world)"))
//console.log(lambda_compile("(-x -y y) 1 0"))

//var stuff = (S (I (y z)))
//var other = (-x (x (x (x x))))

/*

game dict
  set p_x 0
  set b_x 0
  set b_y 0
  set time 0

//game dict ...

on_tick -game -time
  

  
  

*/
