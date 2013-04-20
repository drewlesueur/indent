var lambda_compile = function (raw_code) {
  // lambda parens doesn't mean call a funciton
  // passing a parameter does?
  code = parens(raw_code) 
}

var is_array = function (a) {
  return Object.prototype.toString.call(a) === '[object Array]'
}

var to_linked_list = function (list, index) {
  index = index || 0
  if (index >= list.length) {
    return null;
  }
  var item = list[index]
  if (is_array(item)) {
    item = to_linked_list(item, 0)
  }
  return [item, to_linked_list(list, index + 1)] 
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

var stuff = (S (I (y z)))
var other = (-x (x (x (x x))))
