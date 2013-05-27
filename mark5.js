var makeFunction = function (arg, body) {
  var theArg = {value: "", name: "a", __isArg: true}
  for (var i = 0; i < body.length; i++) {
    if (body[i] == arg) {
      body[i] = theArg;
    }
  }
  return {
    arg: theArg,
    body: body
  }
}

var isArg = function (arg) {
  if (arg === Object(arg)) {
    return arg.__isArg
  }
  return false
}

var evalFunction = function (func, arg) {
  func.arg.value = arg
  var body = func.body;
  var ret = []
  for (var i = 0; i < body.length; i++) {
    var item = body[i]
    if (isArg(item)) {
      ret.push(item.value)
    } else {
      ret.push(i)
    } 
  }
  return ret;
}

var func = makeFunction("a", ["add1", "a"]);
console.log(evalFunction(func, 3))

