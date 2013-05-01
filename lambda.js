  var lambda_compile = function (raw_code) {
  // lambda parens doesn't mean call a funciton
  // passing a parameter does?
  code = parens(raw_code) 
}

var is_array = function (a) {
  return Object.prototype.toString.call(a) === '[object Array]'
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

console.log(lambda_compile("(-x x) 1"))
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
