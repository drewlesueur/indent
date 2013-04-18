var __slice = [].slice
var jsparens = (function () {
  var l = function () {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return args
  }

  function is_scalar(item) {
    var type = typeof item;
    return type === 'string' || type === 'number' || type === 'boolean';
  }

  var macro_epand = function (expression) {
    if (is_scalar(expression)) {
      return expression
    }

    if (expression.touched) {
      return expression
    }
    
    if (is_scalar(expression[0])) {

    }

    // (name "drew LeSueur") (concat name "!")
    // l( l("name", "Drew LeSueur"), l("concat", "name", "!")  )
  }

  var leval = function (expression) {   
    if (is_scalar(expression)) {
      
    }

    for (var i = 0; i < expression.length; i++) {
      return leval(expression[i]);   
    }
  }
  return {l: l, leval: leval};
})();

var l = jsparens.l
var leval = jsparens.leval

stuff = l("drew", l("dict", 
  l("name", "drew"),
  l("age", 27)
))

//console.log(JSON.stringify(stuff))

console.log(leval("Drew LeSueur"))

leval()

console.log(leval(
  l("name", "Drew LeSueur"),
  l("name")
))




