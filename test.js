var assert = require("assert")

var e = function (a, b, c) { assert.equal(a, b, c) }
var de = function (a, b, c) { 
  try {
    assert.deepEqual(a, b, c) 
  } catch (e) {
    console.log(e)
    console.log("Actual..")
    console.log(JSON.stringify(e.actual))
    process.exit(1)
  }
}


de(parens("hello world"), ["hello","world"], "test simple parens")
de(parens("(hello world)"), [["hello","world"]], "test simple parens 2")
de(parens("(hello world (some cool) things ((in here) yo))"), [["hello","world",["some","cool"],"things",[["in","here"],"yo"]]] , "test simple parens 2")

de(parens("hello world", true), ["hello",["world",[]]], "test simple parens linked list")
de(parens("(hello world (some cool) things ((in here) yo))", true), 
		[["hello",["world",[["some",["cool",[]]],["things",[[["in",["here",[]]],["yo",[]]],[]]]]]],[]] ,
		"test simple parens 2")
//de(false, true)

