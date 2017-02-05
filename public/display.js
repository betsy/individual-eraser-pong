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


var chick = new Image();
chick.src = "chick.png";
var bg = new Image();
bg.src = "http://images.all-free-download.com/images/graphiclarge/simple_cartoon_cloud_and_star_background_6815607.jpg";

function draw(){
  game.update(player, boxes, keys)

  ctx.clearRect(0,0,width,height);
  ctx.drawImage(bg,0,0, width, height);
  ctx.drawImage(chick, 0, 0, 50, 50,
                    player.x, player.y, 50, 50);

  if(player.health<0 || player.y > 99999){
    ctx.fill();
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, width, height);
    return;
  }

  // ctx.fillRect(player.x, player.y, player.width, player.height);

  // ctx.fillStyle = "black";
  

  for (var i = 0; i < boxes.length; i++) {
    for (var j = 0; j < boxes[i].length; j++) {
        if(boxes[i][j] == 1){
          // ctx.fill();
          // ctx.fillStyle = "black";
          // ctx.fillRect(j*game.consts.block_size, i*game.consts.block_size, game.consts.block_size, game.consts.block_size);
          animate(j*game.consts.block_size, i*game.consts.block_size, 1);
        }
        else if (boxes[i][j] == 2){
          animate(j*game.consts.block_size, i*game.consts.block_size, 2);
        }
        else if (boxes[i][j] == 3){
          animate(j*game.consts.block_size, i*game.consts.block_size, 3);
          // ctx.fill();
          // ctx.fillStyle = "green";
          // ctx.fillRect((j+0.25)*game.consts.block_size, (i+0.25)*game.consts.block_size, game.consts.block_size/2, game.consts.block_size/2);
        }
        // else{
        //   ctx.fill();
        //   ctx.fillStyle = "black";
        //   ctx.fillRect((j+0.25)*game.consts.block_size, (i+0.25)*game.consts.block_size, game.consts.block_size/2, game.consts.block_size/2);
        // }
    }
    ctx.fill();
    ctx.fillStyle = "red";
    ctx.fillRect(0,10.75*60,width,15);
    ctx.fill();
    ctx.fillStyle = "green";
    ctx.fillRect(0,10.75*60,width*player.health/200,15);
  }

  requestAnimationFrame(draw);
}

var fire = new Image();
var land = new Image();
var sleepy = new Image();

land.src = "http://i.imgur.com/ygVDUBX.png";
fire.src = "http://i.imgur.com/nZ5dorL.png";
sleepy.src = "http://i.imgur.com/aWopdqe.png";

var shift = 0;
var frameWidth = 60;
var frameHeight = 60;
var totalFrames = 5;
var currentFrame = 0;
 
function animate(xcoor, ycoor, type) {
  ctx.clearRect(xcoor, ycoor, frameWidth, frameHeight);
  //draw each frame + place them in the middle
  var myImage = null;
  if(type==1){
    myImage = land;
  }
  else if(type==2){
    myImage = fire;
  }
  else if(type==3){
    myImage = sleepy;
  }
  // else if(type==-1){
  //   myImage = chick;
  // }
  console.log(currentFrame,totalFrames,shift);
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