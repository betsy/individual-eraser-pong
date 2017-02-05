var socket = io();
var boxes = game.make_boxes();
(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("myCanvas"),
 ctx = canvas.getContext("2d")


var width = game.consts.width,
    height = game.consts.height,
    player = game.player,
    keys = [];

canvas.width = width;
canvas.height = height;

socket.on('sync', function (p1, server_boxes) {
  player = p1;
  boxes = server_boxes;
  // console.log(player.x,player.y);
})

function draw(){
  game.update(player, boxes, keys)

  ctx.clearRect(0,0,width,height);
  ctx.fill();
  ctx.fillStyle = "red";

  if(player.health<0 || player.y > 99999){
    ctx.fillRect(0, 0, width, height);
    return;
  }

  ctx.fillRect(player.x, player.y, player.width, player.height);

  // ctx.fillStyle = "black";
  

  for (var i = 0; i < boxes.length; i++) {
    for (var j = 0; j < boxes[i].length; j++) {
        if(boxes[i][j] == 1){
          ctx.fill();
          ctx.fillStyle = "black";
          ctx.fillRect(j*game.consts.block_size, i*game.consts.block_size, game.consts.block_size, game.consts.block_size);
        }
        else if (boxes[i][j] == 2){
          animate(j*game.consts.block_size, i*game.consts.block_size);
        }
        else if (boxes[i][j] == 3){
          ctx.fill();
          ctx.fillStyle = "green";
          ctx.fillRect(j*game.consts.block_size, i*game.consts.block_size, game.consts.block_size, game.consts.block_size);
        }
        // else{
        //   ctx.fill();
        //   ctx.fillStyle = "black";
        //   ctx.fillRect((j+0.25)*game.consts.block_size, (i+0.25)*game.consts.block_size, game.consts.block_size/2, game.consts.block_size/2);
        // }
    }
    ctx.fill();
    ctx.fillStyle = "red";
    ctx.fillRect(0,10.5*60,width,30);
    ctx.fill();
    ctx.fillStyle = "green";
    ctx.fillRect(0,10.5*60,width*player.health/200,30);
  }

  requestAnimationFrame(draw);
}

var myImage = new Image();
myImage.src = "http://i.imgur.com/nZ5dorL.png";
 
var shift = 0;
var frameWidth = 60;
var frameHeight = 60;
var totalFrames = 5;
var currentFrame = 0;
 
function animate(xcoor, ycoor) {
  ctx.clearRect(xcoor, ycoor, frameWidth, frameHeight);
  //draw each frame + place them in the middle
  ctx.drawImage(myImage, shift, 0, frameWidth, frameHeight,
                    xcoor, ycoor, frameWidth, frameHeight);
  shift += frameWidth + 1;
  /*
    Start at the beginning once you've reached the
    end of your sprite!
  */
  if (currentFrame == totalFrames) {
    shift = 0;
    currentFrame = 0;
  }
  currentFrame++;
  requestAnimationFrame(animate);
}

window.addEventListener("load",function(){
    draw();
});