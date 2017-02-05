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