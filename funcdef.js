greet, person = "hello", concat, person
greet person = "hello" concat person

app = dict
  state, dict
    maps, dict

//obj, str -> state
getFn, app, name = app, get, name

app =
  obj

  state = 
    maps, {}
    boxes, {}
    innerWidth, ($, window, width, )
    innerHeight, ($, window, width, )
  run, state, event = 
    name = event, get, 0
    data = event, get, 1
    app, getFn, name, state, data
  getHistoryMapDimensions, state =
    obj
    left = 0

 



if, true, a, b = a
if, false, a, b = b

true, a, b = a
false, a, b, = b

dict a, b, get, a = b

assoc, fn, a, b =
  newFunc, get, a = b
  newFunc, get, other = fn, get, other
  newFunc, length, = fn, length, plus, 1
  newFunc, set = assoc, newFunc
  newFunc


mylist = make-list, aimee, jwl, gra, end-list

make-list, item = make-list
make-list, end-list = 





loop, times, fn, start = 
  times, is, 0, start
  loop, (times, minus, 1), (fn, i), (fn, i, start)

reduce, list, fn, start = 
  


fac, 1 = 1
fac, x = x, times, (x, minus, 1, fac)

fac, x = 
 x, is, 1, 1
 x, minus, 1, fac

fac 1 = 1
fac x = x times (x minus 1 fac)

fac x =
 x is 1 1
 x minus 1 fac


add_player state player = state set players (state get players push player)
left_button_down state player = state get players



run state eventName eventData =
  event is addPlayer
    state set players (state get players push eventData)
    


