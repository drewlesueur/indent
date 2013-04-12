<?
function l() {
  return func_get_args();
}

$stuff = l("drew", l("dict", l("name", "drew"), l("age", 27)));

print json_encode($stuff);
?> 
