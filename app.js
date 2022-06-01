
const express=require('express');
const app=express()
const server=require('http').Server(app)
const io=require('socket.io')(server)
const session=require('express-session');
const passport = require('passport');
const {ExpressPeerServer}=require('peer');
const peerServer=ExpressPeerServer(server,{debug:true});
app.set('view engine','ejs')

//middleware function for authenctication check
function islogged(req,res,next){req.user ? next():res.redirect('/')}
//middleware for uplading ejs , css pictures when uplading 
app.use(express.static(__dirname + '/public'))

/*PeerServer is a peer-to-peer client server using WebRTC,
 where your browser acts as a server for other browsers across
  WebRTC peer-to-peer data channels  
  
  Note that no peer-to-peer data goes through the server;
   The server acts only as a connection broker.
  */
app.use('/peerjs',peerServer);


app.use(session({secret :"ay 7aga"}));
app.use(passport.initialize());
app.use(passport.session());

require('./auth')

app.get('/auth/google',passport.authenticate('google',
{scope:['email','profile']}))

app.get('/google/callback',passport.authenticate('google',{
successRedirect:'/indicator',
failureRedirects:'/auth/failure'
}))
app.get('/auth/failure',(req,res)=>{
res.send('something went wrong')
})
app.get('/protected',(req,res)=>{
         // res.send("7ngeeb name isa")      
         res.status(404).render('you must write roomid', {title: "Sorry, page not found"});
        });
app.get('/indicator',(req,res)=>{
    let name=req.user.displayName
    res.render('indicator')
         //res.send(` hello ${req.user.displayName} by ${req.user.email}`);

})

app.get('/protected/:roomID',islogged,(req,res)=>{
   let data={
    roomid:req.params.roomID,
    name:req.user.displayName
   }
res.render('rooms',data);
})
app.get('/',(req,res,next)=>{
res.render('index')
})
//  socket connection for server
io.on('connection',socket=>{
socket.on('join-room',(roomid,userid,name)=>{
    socket.join(roomid)
   socket.broadcast.to(roomid).emit('userconnected',userid,name)
    //messages
        socket.on('message',(message,name)=>{
            io.to(roomid).emit('createMessage',message,name)
        })   
       
})
})
server.listen(process.env.PORT || 3000,()=>{
console.log("port is listing on 3000")
})

