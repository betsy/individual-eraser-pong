(function(exports){

    // your code goes here

exports.consts = {
	width: 1260,
    height: 660,
    friction: 0.8,
    gravity: 0.8,
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
  grounded: false,
  health: 200
};

exports.make_boxes = function(){
	 // dimensions
	var boxes = new Array(11);
	for (var i = 0; i < boxes.length-1; i++) {
	  boxes[i] = new Array(21).fill(0);
	}
	boxes[boxes.length-1] = new Array(21).fill(1);
	console.log(boxes);
	return boxes;
};

 exports.click_boxes = function(boxes, clickx, clicky) {
    boxes[clicky][clickx] = (1 + boxes[clicky][clickx]) % 3;
    /* number of states
     0 = nothing
     1 = land
     2 = lava
    */
}

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
    	for (var j = 0; j < boxes[i].length; j++) {
        	if (boxes[i][j] == 0 || boxes[i][j] == null) continue;
	        var dir = colCheck(player, j*exports.consts.block_size, i*exports.consts.block_size);

	        if(boxes[i][j] == 2) player.health--;
	        if (dir === "l" || dir === "r") {
	            player.velX = 0;
	            player.jumping = false;
	        } else if (dir === "b") {
	            player.grounded = true;
	            player.jumping = false;
	        } else if (dir === "t") {
	            player.velY *= -1;
	        }
	        else if (boxes[i][j] == 2){
	        	player.health++;
	        }
    	}
    }
    
    if(player.grounded){
         player.velY = 0;
    }
    
    player.x += player.velX;
    player.y += player.velY;
};

function colCheck(player, bx, by) {
    // get the vectors to check against
    var blocksize = exports.consts.block_size;
    var vX = (player.x + (exports.player.width / 2)) - (bx + (blocksize / 2)),
        vY = (player.y + (exports.player.height / 2)) - (by + (blocksize / 2)),
        // add the half widths and half heights of the objects
        hWidths = (player.width / 2) + (blocksize / 2),
        hHeights = (player.height / 2) + (blocksize / 2),
        colDir = null;

    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                player.y += oY;
            } else {
                colDir = "b";
                player.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                player.x += oX;
            } else {
                colDir = "r";
                player.x -= oX;
            }
        }
    }
    // console.log(colDir);
    return colDir;
}

/*
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
}*/

})(typeof exports === 'undefined'? this['game']={}: exports);