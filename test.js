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

de(parens("(-x x) 20", true), [["-x",["x",[]]],["20",[]]],  "lambda")
de(parens("-x x 20", true), ["-x",["x",["20",[]]]],  "lambda")
de(parens("-x -y -z (x y z) true Drew Aimee", true),
["-x",["-y",["-z",[["x",["y",["z",[]]]],["true",["Drew",["Aimee",[]]]]]]]]		
, "true false")// -x -y -z (x y z) true Drew Aimee

//should these be the same thing?
//parens dont nec. mean function call?
//lambda("-x x 20")
//lambda("-x (x) 20")
//lambda("(-x x) 20")
//lambda("(-x x 20)")
//
// -x -y -z (x y z) true Drew Aimee

// fn x fn y fn z (x y z) true Drew Aimee
// K -x -y x
// I -x x
// KI -y -x x





//de(false, true)

