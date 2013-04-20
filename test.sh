#!/usr/bin/env bash

echo "hello world"
cat parens.js indent.js lambda.js > mylang.js
cat mylang.js test.js > test_full.js
node test_full.js

the_exit_code=$?
if [[ $the_exit_code != 0 ]] ; then
  tput setaf 1 #red
  echo "Test failed"
else
  tput setaf 2 #green
  echo "Tests passed"
fi
tput sgr0
