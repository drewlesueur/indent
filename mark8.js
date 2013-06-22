var macros = {
  "get": function (state, call) {
    return call[1] + "." + call[2]
  },
  "+": function (state, call) {
    return call[1] + " + " + call[2];
  },
  "-": function (state, call) {
    return call[1] + " - " + call[2];
  },
  "/": function (state, call) {
    return call[1] + " / " + call[2];
  },
  "*": function (state, call) {
    return "(" + doReturn(state, call[1]) + " * " + doReturn(state, call[2]) + ")"
  },
  "^": function (state, call) {
    return "Math.pow(" + doReturn(state, call[1]) + ", " + doReturn(state, call[2]) + ")"
  },
  "if": function (state, call) {
    return "(" + doReturn(state, call[1]) + " ? " + doReturn(state, call[2]) + " : " + doReturn(state, call[3]) + ")"
  },
  is: function (state, call) {
    return "(" + doReturn(state, call[1]) + " === " + doReturn(state, call[2]) + ")"
  },
  dict: function (state, call) {
    var ret = []  
    for (var i = 1; i < call.length; i++) {
      var item = call[i]
      ret.push(item[0] + ":" + doReturn(state, item[1]));
    }
    return "{" + ret.join(",\n") + "}"
  },
  concat: function (state, call) {
    return doReturn(state, call[1]) + " + " + doReturn(state, call[2])
  },
  spaced: function (state, call) {
    var ret = []
    for (var i = 1; i < call.length; i ++) {
      ret.push(doReturn(state, call[i]))
    }
    return ret.join(" +  \" \" + ")
  },
  str: function (state, call) {
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
  var varName = words[0];
  var useVar = (varName in state.scope) ? "" : "var ";
  state = addCompiledLine(state, useVar + words[0] + " = " + doReturn(state, call) + ";")
  state.scope[words[0]] = "here :)"
  return state
}

var defineFunction = function (state, left, right) {
  var funcName = left[0] 
  var argNames = left.slice(1)
  var args = argNames.join(", ")
  
  /*
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
  */

  if (!_.isArray(right[0])) {
   right = [right]
  }

  state.scope[funcName] = "here :)"
  _.each(argNames, function (name) {
    state.scope[name] = "here :)"
  })
  state = addCompiledLine(state, "var " + funcName + " = function (" + args +") {")
  
  //debugger
  //if (_.isArray(right)) {
    state = addCompiledLine(state, mark8(right, state.givenIndentCount + 1, state.scope));
  //} else {
    //state = addCompiledLine(state, returning(state, right))
  //}
  state = addCompiledLine(state, "}")
  if (state.i == state.length - 1) {
    addCompiledLine(state, returning(state, funcName))
  }
  return state;
}

var returning = function (state, line) {
  if (false && state.givenIndentCount === 0) {
    return line
  } else if (state.i == state.length - 1){
    return "return " + line
  } else {
    return line
  }
}
var maybeString = function (state, varName) {
  if (parseFloat(varName) == varName) {
    return varName
  }
  if (varName in state.scope) {
    return varName
  } else {
    return "\"" + decodeURIComponent(varName).replace(/\n/g,"\\n").replace(/\"/g, "\\\"") + "\"" 
  }

} 
var doReturn = function(state, call) {
  //(say (hello world) yo
  var ret  = [];
  if (_.isArray(call)) {
    if (call.length == 1 && _.isString(call[0])) {
      return maybeString(state, call[0])
    }

    if (!_.isArray(call[0]) && call[0] in macros) {
      return macros[call[0]](state, call)
    } else if ((!_.isArray(call[0]) && call[0] in state.scope) || _.isArray(call[0])) {
      ret.push(doReturn(state, call[0]))
      //ret.push(call[0])
      ret.push("(")
      var miniret = []
      for (var i = 1; i < call.length; i ++) {
        miniret.push(doReturn(state, call[i]))
      }
      ret.push(miniret.join(", "))
      ret.push(")")
      return ret.join("");
    } else {
      return "\"" + call.join(" ") + "\""
    }

  } else {
    return maybeString(state, call)
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
    state = addCompiledLine(state, returning(state, doReturn(state, line)))
  }
  return state;
}

var mark8 = function (code, givenIndentCount, givenScope) {
  if (!givenIndentCount) givenIndentCount = 0;
  if (!givenScope) givenScope = {};
  var parsed = _.isArray(code) ? code : indent(code)
  var length = parsed.length
  var state = {
    ret: [],
    givenIndentCount: givenIndentCount,
    scope: givenScope,
    parsed: parsed,
    length: length
  }

  for (var i = 0; i < length; i++) {
    var line = parsed[i];
    state.i = i
    state = compileLine(line, state);
  }
  return state.ret.join("\n");
}
