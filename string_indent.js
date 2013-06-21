
var string_indent = function (input) {
  var lines = input.split("\n")
  var newLines = []
  var i = 0

  var getLastStringLine = function (lines, indentCount, i) {
    var ret = {i: i}
    ret.lines = []
    while (true) {
      if (i >= lines.length) {
        return ret;
      }
      var line = lines[i]; 
      var lineIndentCount = get_indent_count(line)
      if (lineIndentCount < indentCount && line.length > 0) {
        break
      } else {
        ret.lines.push(line.substr(indentCount))
      }
      i += 1 
    }
    ret.i = i
    return ret;

  }

  for (var j = 0; j < lines.length; j++) {
    if (i >= lines.length) { break }
    var line = lines[i]
    var startString = line.indexOf("=  ");
    if (startString != -1) {
      var indentCount = get_indent_count(line)
      var info = getLastStringLine(lines, indentCount + 2, i + 1)
      i = info.i - 1
      var strLines = info.lines
      var generatedStr = strLines.join("\n")
      newLines.push(line.substr(0, startString) + "= " + encodeURIComponent((generatedStr)))
    } else {
      newLines.push(line)
    }
    i += 1;
  }

  return newLines.join("\n") 
}




/*
Takes input like


  hello world ---
    this is an indented string
    stuff goes here

  other stuff

and returns

  hello world $(this is an indented string\nstuff goes here)






*/
