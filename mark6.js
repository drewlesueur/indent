var mark6 = function (code, globals) {
  var parsed = indent(code);
  var length = parsed.length;
  var state = {
    globals: globals || {},
    ret: [],
    funcs: {
      concat: {
        arity: 2
      }
    }
  }

  // this compiler knows about functions and their arity

 
  for (var i = 0; i < length; i++) {
    var line = parsed[i];
    state = compileLine(line, state);
  }
}

var compileLine = function (line, state) {
  for (var i = 0; i < line.length; i++) {
    var item = line[i];
    if (item == "=") {
      var names = line.slice(0, i) 
      var defs = line.slice(i+1) 
      if (names.length > 1) {
        state = defFunc(names, defs, state)
      } else {
        state = assignVar(names, defs, state)
      }
    } else {
      state.ret.push(funcCall(line, state))
    }
  }
  return state;
}

var assignVar = function (names, defs, state) {
  var name = names[0];
  state.ret.push("var "  + name + " = " + funcCall(defs, state) +  ";");
  //state.names.push()
  return state;
}


// recursion?!
var defFunc = function (names, defs, state) { 
  var funcName = names[0]
  var functionScopeNames = {}
  for (var key in state.globals) {
    functionScopeNames[key] = state.globals[key]
  }
  var newVars = names.slice(1)
  for (var key in newVars) {
    functionScopeNames[key] = "";
  } 
  state.funcs[0] = {
    arity: names.length - 1,
    code: mark6(code, functionScopeNames) 
  }
}

// "name" substr 0 1 toUpperCase
// greet name = "hello " concat name
// todo: add types. if a funciton returns a function you need to know

var funcCall = function (line, state) {
  var len = line.length
  // todo: special ones like if statements

  var funcCallState = {
    i: 0,
    line: line,
    funcs: state.funcs,
    globals: state.globals,
    ret: []
  }
  while (funcCallState.i < len) {
    funcCallState = stepFuncCall(line, funcCallState);
  }
  return funcCallState.ret;
}

var isObject = function (obj) {
  return obj === Object(obj);
}

var stepFuncCall = function (line, funcCallState) {
  var item = line[funcCallState.i];
  if (isObject(item)) {
    return funcCall(item, funcCallState)
  }

  if (funcCallState.inFunction) {
    funcCallState.arity -= 1
    funcCallState.ret.push(item)
    if (funcCallState.arity == 0) {
      if (funcCallState.returnFunc) {
        funcCallState.ret = [funcCallState.ret]
        funcCallState.arity = funcCallState.returnFunc.arity 
        funcCallState.returnFunc = funcCallState.funcs[funcCallState.returnFunc.returnFunc]
      } else {
        funcCallState.inFunction = false;
      }
    } else { 
    }
  } else if (item in funcCallState.funcs) {
    if (funcCallState.ret.length) {
      funcCallState.ret = [item].concat(funcCallState.ret)
    } else {
      funcCallState.ret = [item]
    }
    funcCallState.inFunction = true
    funcCallState.arity = funcCallState.funcs[item].arity
    funcCallState.returnFunc = funcCallState.funcs[funcCallState.funcs[item].returnFunc]
  } else {
    funcCallState.ret = [item] 
  }
  funcCallState.i += 1
  return funcCallState
}

var testScope = {
  funcs: {
    save: {arity: 2, returnFunc: "someFunc"} ,
    someFunc: {arity: 1},
    collect: {arity: 2} ,
    select: {arity: 2} ,
    incMaker: {arity: 1, returnArity: 1} ,
  }
}

console.log(funcCall("save name content".split(" "), testScope))
console.log(funcCall("name save content".split(" "), testScope))
console.log(funcCall("name save content forget".split(" "), testScope))
console.log(funcCall("save name content forget".split(" "), testScope))
//console.log(funcCall("people collect content"), testScope)
//console.log(funcCall("people collect content select fun"), testScope)
/*

greet name = name concat hello




*/
