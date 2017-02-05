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
    player = {
      x : width/2,
      y : height/2,
      width : 50,
      height : 50,
      speed: 8,
      velX: 0,
      velY: 0,
      jumping: false,
      grounded: false
    },
    keys = [],
    friction = 0.8,
    gravity = 1.3;


// Loading socket.io

const PORT = process.env.PORT || 3000;

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
        console.log(player.x+" "+player.y);
        // update();
    }); 
    console.log("asdf");
    setInterval(function(){
		update();
	},20);
	setInterval(function(){
		socket.emit('player',player);
	},40);
});


function make_boxes() {
// dimensions
var boxes = [];
boxes.push({
    x: 300,
    y: 300,
    width: 10,
    height: 600
});
boxes.push({
    x: 0,
    y: 600 - 2,
    width: 600,
    height: 50
});
boxes.push({
    x: 600 - 10,
    y: 0,
    width: 50,
    height: 600
});

boxes.push({
    x: 420,
    y: 450,
    width: 80,
    height: 80
});
boxes.push({
    x: 170,
    y: 50,
    width: 80,
    height: 80
});
boxes.push({
    x: 220,
    y: 100,
    width: 80,
    height: 80
});
boxes.push({
    x: 270,
    y: 150,
    width: 40,
    height: 40
});
return boxes;
}

var boxes = make_boxes();

function update() {
    // check keys
    if (keys[38] || keys[32]) {
        // up arrow or space
        if (!player.jumping && player.grounded) {
            player.jumping = true;
            player.grounded = false;
            player.velY = -player.speed * 2;
        }
    }
    if (keys[39]) {
        // right arrow
        if (player.velX < player.speed) {
            player.velX++;
        }
    }
    if (keys[37]) {
        // left arrow
        if (player.velX > -player.speed) {
            player.velX--;
        }
    }

    player.velX *= friction;
    player.velY += gravity;

    // ctx.clearRect(0, 0, width, height);
    // ctx.fillStyle = "black";
    // ctx.beginPath();
    
    player.grounded = false;
    for (var i = 0; i < boxes.length; i++) {
        // ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
        
        var dir = colCheck(player, boxes[i]);

        if (dir === "l" || dir === "r") {
            player.velX = 0;
            player.jumping = false;
        } else if (dir === "b") {
            player.grounded = true;
            player.jumping = false;
        } else if (dir === "t") {
            player.velY *= -1;
        }

    }
    
    if(player.grounded){
         player.velY = 0;
    }
    
    player.x += player.velX;
    player.y += player.velY;

    // ctx.fill();
    // ctx.fillStyle = "red";
    // ctx.fillRect(player.x, player.y, player.width, player.height);

    // requestAnimationFrame(update);
}

function colCheck(shapeA, shapeB) {
    // get the vectors to check against
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null;

    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.y += oY;
            } else {
                colDir = "b";
                shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
            } else {
                colDir = "r";
                shapeA.x -= oX;
            }
        }
    }
    return colDir;
}

server.listen(PORT);