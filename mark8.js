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
  "if": function (call) {
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
  concat: function (call) {
    return doReturn(call[1]) + " + " + doReturn(call[2])
  },
  str: function (call) {
    return "\"" + call.slice(1).join(" ") + "\""
  } 
}

var whiteSpace = function (len) {
  len = len * 2
  var ret = "";
  _.times(len, function () {
    ret += " "
  })
  return ret;
}

var addCompiledLine = function (state, line) {
  state.ret.push(whiteSpace(state.givenIndentCount) + line)
  return state;
}

var assign = function (state, words, call) {
  state = addCompiledLine(state, "var " + words[0] + " = " + doReturn(call) + ";")
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

  state = addCompiledLine(state, "\nvar " + funcName + " = function (" + args +") {")
  if (_.isArray(right)) {
//debugger
    state = addCompiledLine(state, mark8(right, state.givenIndentCount + 1));
  } else {
    state = addCompiledLine(state, returning(state, right))
  }
  state = addCompiledLine(state, "}")
  return state;
}

var returning = function (state, line) {
  if (state.givenIndentCount === 0) {
    return line
  } else {
    return "return " + line
  }
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
    var varName = line.slice(0, 1)
    return assign(state, varName, right)
  } else if (equalSign > 1) {
    return defineFunction(state, line.slice(0, equalSign), line.slice(equalSign + 1))
  } else {
    state.ret.push();
    state = addCompiledLine(state, returning(state, doReturn(line)))
  }
  return state;
}

var mark8 = function (code, givenIndentCount) {
  if (!givenIndentCount) givenIndentCount = 0;
  var parsed = _.isArray(code) ? code : indent(code)
  var length = parsed.length
  var state = {
    ret: [],
    givenIndentCount: givenIndentCount
  }

  for (var i = 0; i < length; i++) {
    var line = parsed[i];
    state = compileLine(line, state);
  }
  return state.ret.join("\n");
}
