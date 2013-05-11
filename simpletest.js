var write = function (stuff) {
	document.write(stuff)
}

var colorize = function (color) {
	return function (stuff) {
		return write("<span style=\"color:"+color+";\">" + stuff + "</span>\n")
	}
}

var fail = colorize("red")
var pass = colorize("green")
var info = colorize("blue")

var assert = function (value, message) {
	if (value) {
		pass(message)
	} else {
		fail(message)
	}
}

window.gotExpected = []
var asserte = function (got, expected, message) {
	if ((typeof expected) == "object") {
		expected = JSON.stringify(expected, null, 4)
	}
	if ((typeof got) == "object") {
		got = JSON.stringify(got, null, 4)
	}
	if (expected == got) {
		pass(message)
	} else {
		window.gotExpected.push([got, expected])
		fail(message)
		info("  got " + got)
		info("  expected " + expected)
	}
}

document.write("<pre>")

info("GPS Insight Javascript tests")
