(function(exports){

    // your code goes here

exports.consts = {
	width: 600,
    height: 600,
    friction: 0.8,
    gravity: 1,
    block_size: 60
};

exports.player = {
  x : exports.consts.width/2,
  y : exports.consts.height/2,
  width : 50,
  height : 50,
  speed: 8,
  velX: 0,
  velY: 0,
  jumping: false,
  grounded: false
};

exports.make_boxes = function(){
	 // dimensions
	var boxes = new Array(10);
	for (var i = 0; i < 20; i++) {
	  boxes[i] = new Array(10);
	}
	boxes[5][3] = 1;


	
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
};

exports.update = function(player, boxes, keys){
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

    player.velX *= exports.consts.friction;
    player.velY += exports.consts.gravity;
    
    player.grounded = false;
    for (var i = 0; i < boxes.length; i++) {
        
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
};
/*
function colCheck(ax, ay, bx, by) {
    // get the vectors to check against
    var blockwidth = exports.consts.block_size;
    var blockheight = exports.consts.block_size;
    var vX = (ax + (blockwidth / 2)) - (bx + (blockwidth / 2)),
        vY = (ay + (blockheight / 2)) - (by + (blockheight / 2)),
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
*/

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

})(typeof exports === 'undefined'? this['game']={}: exports);