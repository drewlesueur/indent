#!/usr/bin/env node
var _ = require("./underscore-min.js")
console.log(process.argv)
console.log(process.env)
require("child_process").exec("pwd", function (err, out) {
  console.log(out.toString())
})
