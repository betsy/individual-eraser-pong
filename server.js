var http = require('http');
var fs = require('fs');

// Loading the file index.html displayed to the client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

var width = 600,
    height = 600,
    p1 = {
      x : width/2,
      y : height/2,
      width : 50,
      height : 50,
      speed: 13,
      velX: 0,
      velY: 0,
      jumping: false
    },
    keys = [],
    friction = 0.8,
    gravity = 2.0;


// Loading socket.io
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket, username) {
    // When the client connects, they are sent a message
    socket.emit('message', 'You are connected!');
    // The other clients are told that someone new has arrived
    socket.broadcast.emit('message', 'Another client has just connected!');

    // As soon as the username is received, it's stored as a session variable
    socket.on('little_newbie', function(username) {
        socket.username = username;
    });

    // When a "message" is received (click on the button), it's logged in the console
    socket.on('player move', function (message) {
        // The username of the person who clicked is retrieved from the session variables
        keys[message.keyCode] = message.val;
        // console.log(message);
        console.log(p1.x+" "+p1.y);
        // update();
    }); 
    console.log("asdf");
    setInterval(function(){
		update();
	},20);
	setInterval(function(){
		socket.emit('p1',p1);
	},40);
});


function update(){
  // check keys
  // console.log("oidsgj");
  // return;
    if (keys[38] || keys[32]) {
        // up arrow or space
      if(!p1.jumping){
       p1.jumping = true;
       p1.velY = -p1.speed*2;
      }
    }
    if (keys[39]) {
        // right arrow
        if (p1.velX < p1.speed) {             
            p1.velX++;         
         }     
    }     
    if (keys[37]) {         
        // left arrow         
        if (p1.velX > -p1.speed) {
            p1.velX--;
        }
    }
 
    p1.velX *= friction;
 
    p1.velY += gravity;
 
    p1.x += p1.velX;
    p1.y += p1.velY;
 
    if (p1.x >= width-p1.width) {
        p1.x = width-p1.width;
    } else if (p1.x <= 0) {         
        p1.x = 0;     
    }    
  
    if(p1.y >= height-p1.height){
        p1.y = height - p1.height;
        p1.jumping = false;
    }
}

server.listen(3000);