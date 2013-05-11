// js lazy eval
// sort of a lazy eval in js. 
// you can write js code that is easy to change to another language
// this is not how I would implement it if writing a lang from scratch.
// i would just implement a lazy calling strategy


var f5 = function () {

}
//


var add = function (a, b) {
  return a + b;
}



var lazy = function(fn) {
  fn.isLazy = true;
  return function (a) {
    return function () {
      fn(a)
    }
  }
};

var isScalar = function (item) {
    var type = typeof item;
    return type === 'string' || type === 'number' || type === 'boolean';
}

var lazyEval = function (a) {
  if (isScalar(a)) {
    return a
  } else if (a.isLazy) {
    return a()
  } else {
    return a;
  }
}

var f4 = {
  add: lazy(function (a) { return function (b) {
    return lazyEval(a) + lazyEval(b)
  }}),
  identity: lazy(function (a) {
    return lazyEval(a)
  }),
  ifyo: lazy(function (a) { return lazy(function (b) { return lazy(function (c) {
    if (lazyEval(a)) {
      lazyEval(b)
    } else {
      lazyEval(c)
    }
  })})})
}

console.log(f4.add(1)(2))



