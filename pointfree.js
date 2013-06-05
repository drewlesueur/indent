f x = add (times 2 x) (times 3 x)

f x = add ( (times 2) x) ( (times 3) x ) 

t2 = times 2
t3 = times 3

f x = (add (t2 x)) (t3 x)

f x = (compose add t2 x) (t3 x)


true x y = x
false x y = y
if x y z = x y z

dict x y x = y



handle_new_player player state =
  push player state

player_move player state
 

tick elapsed state = 
  push 
   
game state event = 
  event state
     


