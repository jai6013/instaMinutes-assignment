const express = require('express');
const {Server} = require('socket.io')
const http = require("http")
const PORT = process.env.PORT || 2555;
const router = require('./router')
const cors = require('cors')
const app = express()

let counts = {
   "all": 0
}
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
   res.header("Access-Control-Allow-Headers", "Content-Type");
   res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
   next();
});
const server = http.createServer(app)
const {getUser, removeUser, addUser} = require('./users')
const io = new Server(server,{
   cors:{
      origin:'*',
   }
});
io.on('connection', client => {
   // * for an event named event
   client.on('join_room', data => { 
      console.log(`incoming request to join room:`,data)
      const { username } = data;
      const user = addUser({ id: client.id, name: username, room: 1  });
      console.log(`addUser:`,user)
      if(user.error){
         console.log(user.error)
         client.emit('error', user.message);
         return
      }
      client.join(1);
      client.to(1).emit("room event", { user: user, message:"A new user has joined!" })
   });
   client.on("leave room",()=>{
      removeUser(client.id)
   })
   // * disconnect
   client.on('disconnect', () => { 
      console.log(`total left ${--counts.all}`);
      removeUser(client.id)
   });
   
   client.on("send message", data=>{
      const user = getUser(client.id);
      console.log(user,`is sending message`,data)
      io.to(1).emit("receive message", { message: data.message, username: user.name })
   })
   
   // 
   console.log('broadcasting, total connected:', ++counts.all)
   
   
   // * broadcasting to all users except the user
   client.broadcast.emit("notification",{id:client.id, type:"new-user"})
   
   
});
app.use(router)
app.use(cors());

server.listen(PORT, () => console.log(`sever has started on port ${PORT}`))




