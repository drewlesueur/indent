var __slice = [].slice
var l = function () {
  var args;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return args
}



stuff = l("drew", l("dict", l("name", "drew"), l("age", 27)))

console.log(stuff)

