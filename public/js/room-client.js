 const socket=io();           
         //peer js implementation  
         // every peer create dynaimic ids when it join the peer-server 
         var peer = new Peer(undefined,{
                 path :'/peerjs',
                 host :'video-group-chat-12.herokuapp.com',
                
                 //wheither it is herouko or localaddress
                 port : '3000'|| '443'
             });          

           let peerlist=[];

              /*this method when user joins the browser(peerServer) genartes dynamic id for
               communication between peers */
             peer.on('open',(myid)=>{
            console.log( ` my id is ${myid}`)
            socket.emit('join-room',roomid,myid);
              })
                       //getting the document to make scroll
              const chatMessages=document.getElementsByClassName('main-chat-window')

//container of the videos                       
const videoGrid=document.getElementById('video-grid')
const myvideo=document.createElement('video')

const messageelement=document.createElement('div')

const messages_chat=document.getElementsByClassName('messages')

myvideo.muted=true;

/*lisiting for events from the server as giving the generated id for communication */
socket.on('userconnected',(userid)=>{
                callpeer(userid);         
                   console.log(`${names} connected with ${userid}`)
                       //custom alertt when user connects
                   Swal.fire({
                    title: `user joined the room`,
                    showClass: {
                      popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                      popup: 'animate__animated animate__fadeOutUp'
                    }
                  })     
         })

let myvideostream;
/*videostream is to make user to stop or continue the video */
let videostream; 
/*allow our camera to open directly */
         navigator.mediaDevices.getUserMedia({video:true,audio:true})
         .then((stream)=>{
            videostream=stream;
             addourvideos(stream);                                            
         })        
//handle incoming calls for video 

peer.on('call',function(call){
  //function for allowing video and audio in the web
navigator.mediaDevices.getUserMedia({video:true,audio:true})
.then((stream)=>{
    //addourvideos(stream)
  myvideostream=stream
 call.answer(stream)
call.on('stream',function(remotestream){
    if(!peerlist.includes(call.peer)){
userVideoStream(remotestream)
 peerlist.push(call.peer)
    }

})
}).catch((err)=>{console.log(err+"unable to get media")})
})

function callpeer(id){
navigator.mediaDevices.getUserMedia({video:true,audio:true})
.then((stream)=>{
myvideostream=stream;
//addourvideos(stream);
let call=peer.call(id,stream)
call.on('stream',function(remotestream){
  if(!peerlist.includes(call.peer)){
    peerlist.push(call.peer)
    userVideoStream(remotestream)
  }
})
}).catch((err)=>{console.log(err+"unable to get media")})
}

    function userVideoStream(stream){  
    let video=document.createElement('video') ;
   video.srcObject=stream;
    video.play();
    document.getElementById('user-video').append(video);
   }
//function to apend our video
      function addourvideos(stream){
        myvideostream=stream;
    let video=document.createElement('video'); 
   video.srcObject=stream;
    video.play();
    document.getElementById('own-video').append(video);
           }



 let enabled;
 let enabled1;
//function to mutee which calling  this 2 function down 
    function MuteUnMute(){

  enabled=myvideostream.getAudioTracks()[0].enabled
 enabled1=videostream.getAudioTracks()[0].enabled;

if(enabled&&enabled1){

myvideostream.getAudioTracks()[0].enabled=false;
videostream.getAudioTracks()[0].enabled=false;
setUnmuteButton();
}else{
    setmuteButton()
    myvideostream.getAudioTracks()[0].enabled=true;
videostream.getAudioTracks()[0].enabled=true;

}
}
//function for closing and opening video
function PlayVideo(){
let enabled=myvideostream.getVideoTracks()[0].enabled;
let enabled1=videostream.getVideoTracks()[0].enabled;

if(enabled&&enabled1){
myvideostream.getVideoTracks()[0].enabled=false;
videostream.getVideoTracks()[0].enabled=false;
setPlayVideo()
}
else{
setStopVideo()
myvideostream.getVideoTracks()[0].enabled=true;
videostream.getVideoTracks()[0].enabled=true;
}
}
//here 2 function for mute and 2 function for videoss
//change for mute icon
const setmuteButton=()=>{
  const htm=`
  <i
   class="fas fa-microphone"></i>
  <span>Mute</span>
  `
  document.querySelector('#main-mute-button').innerHTML=htm;
  }
   //change for unmute icon
  const setUnmuteButton=()=>{
  const htm=`
  <i class="unmute fas fa-microphone-slash"></i>
  <span>Mute</span>
  `
  document.querySelector('#main-mute-button').innerHTML=htm;
  }
  //change the icon to the stop video icon 
  const setStopVideo=()=>{
    const htm=`  
    <i class="fa-solid fa-video"></i>
    <span>Stop video</span>
    `
    document.querySelector('#main-video-button').innerHTML=htm
    }
    //play video icon 
    const setPlayVideo=()=>{
    const htm= `  
    <i class=" unvideo fa-solid fa-video-slash"></i>
    <span>play video</span> 
    `
    document.querySelector('#main-video-button').innerHTML=htm
    } 


/*pressing enter and removing the text after pressing enter 
jquery method for pressing enter instead of button
then passing the text written to  server side to display it in chat-messages div 
*/
function pressingEnter(){
let text=$('input')
$('html').keydown((e)=>{
if(e.which==13&&text.val().length!==0){
    console.log(`  :  ${text.val()}`)
    socket.emit('message',text.val(),name);
    text.val('');
}
});      
}
pressingEnter();

////////////////////////////////////////////////////////////////////////////////////
             
//function to covert time from 24 to 12

//get date time for now
let toaday=new Date();
let Timeego=toaday.getHours()+" :"+toaday.getMinutes();

         console.log(Timeego);
         //functiom for converting 24 hour to 12 am pm
  function tConvert(time24) {
    var ts = time24;
    var H = +ts.substr(0,2);
    var h = (H % 12) || 12;
    h = (h < 10)?("0"+h) : h;  // leading 0 at the left for 1 digit hours
    var ampm = H < 12 ? "AM" : " PM";
    ts = h + ts.substr(2, 3) + ampm;
    return ts;
  };             
  /* create message passing the name and message as paramter to the message */
// socket.on('createMessage',(message,name)=>{
//             outputmessage(message); 
//  chatMessages.scrollTop=chatMessages.scrollHeight;
// })
// /* dom function for creating the message to be viewd in the screen */
// function outputmessage(message,name){
// const div=document.createElement('div')
// div.classList.add('messages');
// div.innerHTML=`<p class="name-chat"> ${name}<span>${tConvert(Timeego)}</span></p>
//          <p class="text-chat">
//           ${message}
//          </p>`;
// document.querySelector('.main-chat-window').appendChild(div);
// }



