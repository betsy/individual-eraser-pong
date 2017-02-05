// var http = require('http');
const PORT = process.env.PORT || 3000;


var fs = require('fs');
var express = require('express')
var app = express()
var server = require('http').Server(app);
var io = require('socket.io').listen(app.listen(PORT, function(){console.log("PORT ",PORT)}));
app.use(express.static('public'))


var game = require('./public/game.js');

// Loading the file index.html displayed to the client
app.get('/', function (req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
})

app.get('/player', function (req, res) {
    fs.readFile('./player.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
})

var width = game.consts.width,
    height = game.consts.height,
    player = game.player,
    keys = [];


var boxes = game.make_boxes();
// var io = require('socket.io').listen(server);

// Loading socket.io
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
    }); 

    socket.on('clicked', function(clickx,clicky){
        game.click_boxes(boxes, clickx, clicky)
    });

    setInterval(function(){
        game.update(player, boxes, keys);
    },20);
    setInterval(function(){
        socket.emit('sync',player,boxes);
    },40);
});

