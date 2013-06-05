var macros = {
  "get": function (call) {
    return call[1] + "." + call[2]
  },
  "+": function (call) {
    return call[1] + " + " + call[2];
  },
  "-": function (call) {
    return call[1] + " - " + call[2];
  },
  "/": function (call) {
    return call[1] + " / " + call[2];
  },
  "*": function (call) {
    return call[1] + " * " + call[2];
  },
  ifo: function (call) {
    return "(" + doReturn(call[1]) + " ? " + doReturn(call[2]) + " : " + doReturn(call[3]) + ")"
  },
  is: function (call) {
    return "(" + doReturn(call[1]) + " === " + doReturn(call[2]) + ")"
  },
  dict: function (call) {
    var ret = []  
    for (var i = 1; i < call.length; i++) {
      var item = call[i]
      ret.push(item[0] + ":" + doReturn(item[1]));
    }
    return "{" + ret.join(",\n") + "}"
  },
}

var assign = function (state, words, call) {
  state.ret.push("var " + words[0] + " = " + doReturn(call) + ";")
  return state
}

var defineFunction = function (state, left, right) {
  var funcName = left[0] 
  var args = left.slice(1).join(", ")
  var miniret = []
  for (var i = 0; i <  right.length; i++) {
    item = right[i];
    if (!_.isArray(item)) {
      miniret.push(item)
    } else {
      break; 
    }
  }
  if (miniret.length > 1) {
    right = [miniret]
  } else if (miniret.length == 1) {
    right = miniret[0]
  }

  state.ret.push("\nvar " + funcName + " = function (" + args +") {")
  if (_.isArray(right)) {
    state.ret.push(mark8(right));
  } else {
    state.ret.push("return " + right)
  }
  state.ret.push("}")
  return state;
}

var doReturn = function(call) {
  //(say (hello world) yo
  var ret  = [];
 console.log(call) 
  if (_.isArray(call)) {
    if (call.length == 1) {
      return call[0]
    }

    if (!_.isArray(call[0]) && call[0] in macros) {
      return macros[call[0]](call)
    } else {
      ret.push(doReturn(call[0]))
    }

    //ret.push(call[0])
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
  if (line.length == 0) return state;
  var equalSign = _.indexOf(line, "=")
  if (equalSign == 1) {
    right = line.slice(2)
    if (right.length == 1) right = right[0]
    return assign(state, line.slice(0, 1), right)
  } else if (equalSign > 1) {
    return defineFunction(state, line.slice(0, equalSign), line.slice(equalSign + 1))
  } else {
    state.ret.push("return " + doReturn(line));
  }
  return state;
}

var mark8 = function (code) {
  var parsed = _.isArray(code) ? code : indent(code)
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
