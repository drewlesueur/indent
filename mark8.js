var assign = function (state, words, call) {
  state.ret.push("var " + words[0] + " = " + doReturn(call) + ";")
  return state
}

var doReturn = function(call) {
  //(say (hello world) yo
  var ret  = [];
 console.log(call) 
  if (_.isArray(call)) {
    //if (call.length == 1) {
    //  return call[0]
    //}
    ret.push(call[0])
    ret.push("(")
    var miniret = []
    for (var i = 1; i < call.length; i ++) {
      miniret.push(doReturn(call[i]))
    }
    ret.push(miniret.join(", "))
    ret.push(")")
    return ret.join("");
  } else {
    return call
  }
}

var compileLine = function (line, state) {
  var equalSign = _.indexOf(line, "=")
  if (equalSign == 1) {
    right = line.slice(2)
    if (right.length == 1) right = right[0]
    return assign(state, line.slice(0, 1), right)
  } else if (equalSign > 1) {
    return callFunction(state, line.slice(0, equalSign), line.slice(equalSign + 1))
  } else {
    state.ret.push("return " + doReturn(line));
  }
  return state;
}

var mark8 = function (code) {
  var parsed = indent(code)
  var length = parsed.length
  var state = {
    ret: []
  }

  for (var i = 0; i < length; i++) {
    var line = parsed[i];
    state = compileLine(line, state);
  }
  return state.ret.join("\n");
}
