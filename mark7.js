// in addition to wanting to create a cool functional programming language
// it would be cool to make a cool minimal imperative programming language
// no dynamic allocation, no arguments, no return values.
// lets say you have this big array of bits like 1mb or 512kb.
// and some abstracted system interfaces like networking (very absracted)

time 32
old_time 32
elapsed 32

old_socket_count 8
socket_count 8
socket_index 8
current_socket 40
16 sockets
 id 8
 data 32

player_count 8
player_index 8
16 players
  color 8
  name 64
  x 8
  y 8
  id 8
  touchx 8
  touchy 8

set_elapsed:
  subtract32 time old_time elapsed
  copy32 time old_time 

each_socket:
  copy8 current_data (sockets socket_index data)
  (sockets socket_index data)

main:
  set_elapsed
  clear8 socket_index
  loop8 socket_count socket_index each_socket 
  copy8 socket_count old_socket_count
  render


  
  
  



 
  
