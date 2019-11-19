var switchedTiles = new Array(10);
var lavaswitchedTiles = new Array(10);
var MovingTile = new Array(10);
var anyDown = [];
  
var Tile = {
	x:0,
	y:0,
	init: function(x, y){
		this.x = x;
		this.y = y;
	},
	update: function() {},
	onCollide: function(ai) {},
	Collide: function(player){},
	disappear: function(ai){},
	blocksMovement: false,
	blocksOnlyPlayer: false,
	color:"white",
};
var Moving = {
	x:0,
	y:0,
	vx:0,
	vy:0,
	initing: function(x, y) {
		this.x = x;
		this.y = y;
	},
	update: function(gridSize) {
		if(!this.hitWall) {
			if(this.vx!=0)
				this.x += gridSize / this.vx;
			if(this.vy!=0)
				this.y += gridSize / this.vy;
		}
		this.hitWall = false;
	}, 
	onCollide: function(tile) {
		if(tile.blocksMovement)
			this.hitWall = true;
	},
};

// FLOOR TILE
var FloorTile = function(x, y){
	this.init(x, y);
};
FloorTile.prototype = Object.create(Tile);

// WALL TILE
var WallTile = function(x, y){
	this.init(x, y);
	this.blocksMovement = true;
	this.color = "grey";
};
WallTile.prototype = Object.create(Tile);

// VICTORY TILE
var VictoryTile = function(x, y){
	this.init(x, y);
	this.color = "rgb(203, 255, 117)"; //"rgba(95, 255, 80, 1.0)";	
};
VictoryTile.prototype = Object.create(Tile);
VictoryTile.prototype.onCollide = function(ai) {
	console.log(ai);
	world.victory();
};

// LAVA TILE (kills player)
var LavaTile = function(x, y){
	this.init(x, y);
	this.color = "red";
};
LavaTile.prototype = Object.create(Tile);
LavaTile.prototype.onCollide = function(ai) {
	world.death();
};

// SWITCHED TILE (wall that can be on/off)
var SwitchedTile = function(x, y){
	this.init(x, y);
	this.blocksMovement = true;
	this.color = "rgb(253, 198, 137)";
};
SwitchedTile.prototype = Object.create(Tile);
SwitchedTile.prototype.onCollide = function(ai) {
	this.touchingAI = true;
	// console.log(ai);
	this.justTouching = true;
}
SwitchedTile.prototype.update = function() {
	if(!this.justTouching)
		this.touchingAI = false;
	this.justTouching = false;
}
// SWITCHED TILE (wall that can be on/off)
var LavaSwitchedTile = function(x, y){
	this.init(x, y);
	this.blocksMovement = false;
	this.color = "red";
};
LavaSwitchedTile.prototype = Object.create(Tile);
LavaSwitchedTile.prototype.onCollide = function(ai) {
	this.touchingAI = true;
	// console.log(ai);
	this.justTouching = true;
	world.death();
}
LavaSwitchedTile.prototype.update = function() {
	if(!this.justTouching)
		this.touchingAI = false;
	this.justTouching = false;
}

// SWITCH TILE (toggles wall)
var SwitchTile = function(x, y, id){
	this.init(x, y);
	this.switchingId = id;
	this.color = "rgb(255, 247, 153)";
}
SwitchTile.prototype = Object.create(Tile);
SwitchTile.prototype.onCollide = function(ai) {
	this.down = true;
	anyDown[this.switchingId] = true;
	switchedTiles[this.switchingId].blocksMovement = false;
	switchedTiles[this.switchingId].color = "rgb(235, 235, 235)";
}
SwitchTile.prototype.update = function() {
	if(!anyDown[this.switchingId]) {
		if(!switchedTiles[this.switchingId].touchingAI) {
			switchedTiles[this.switchingId].blocksMovement = true;
			switchedTiles[this.switchingId].color = "rgb(255, 220, 217)";
		}
	}
	anyDown[this.switchingId] = false;
}

// SWITCH TILE (toggles wall)
var LavaSwitchTile = function(x, y, id){
	this.init(x, y);
	this.switchingId = id;
	this.color = "pink";
}
LavaSwitchTile.prototype = Object.create(Tile);
LavaSwitchTile.prototype.onCollide = function(ai) {
	this.down = true;
	anyDown[this.switchingId] = true;
	lavaswitchedTiles[this.switchingId].color = "rgb(235, 235, 235)";
	lavaswitchedTiles[this.switchingId].onCollide = function(ai){};
}
LavaSwitchTile.prototype.update = function() {
	if(!anyDown[this.switchingId]) {
		if(!lavaswitchedTiles[this.switchingId].touchingAI) {
			lavaswitchedTiles[this.switchingId].color = "rgb(255,70,70)";
			lavaswitchedTiles[this.switchingId].onCollide = function(ai){
				world.death();
			};

		}
	}
	anyDown[this.switchingId] = false;
}

// PLAYER WALL TILE (blocks only player)
var PlayerWallTile = function(x, y){
	this.init(x, y);
	this.blocksOnlyPlayer = true;
	this.color = "rgb(155,197,247)";
};
PlayerWallTile.prototype = Object.create(Tile);

var invisibleTile = function(x,y,id){
	this.init(x,y);
	this.switchingId = id;
	this.blocksMovement = true;
	this.color = "white";
};
invisibleTile.prototype = Object.create(Tile);
invisibleTile.prototype.onCollide = function(ai){
	this.down = true;
	anyDown[this.switchingId] = true;
	invisibleTile[this.switchId].color = "gray";
}
invisibleTile.prototype.update = function(){
	if(!anyDown[this.switchingId]){
		if(!invisibleTile[this.switchingId].touchingAI){
			invisibleTile[this.switchingId].onCollide = function(ai){
				invisibleTile[this.switchingId].color = "gray";
			};
		}
	}
	anyDown[this.switchingId] = false;	
}
var MovingTile = function(x,y,id){
	this.init(x,y);
	this.switchingId = id;
	this.blocksOnlyPlayer = false;
	this.blocksMovement = true;
	this.color = "rgb(128,50,50)";
};
MovingTile.prototype = Object.create(Tile);
MovingTile.prototype.onCollide = function(ai){
	this.down = true;
	anyDown[this.switchingId] = true;
}
MovingTile.prototype.update = function(){
	if(!anyDown[this.switchingId]){
		if(!MovingTile[this.switchingId].touchingAI){
			MovingTile[this.switchingId].Collide = function(player){
				MovingTile[this.switchingId].color = "green";
				this.blocksMovement = false;
				MovingTile[this.switchingId].blocksOnlyPlayer = true;
			};
		}
	}
	anyDown[this.switchingId] = false;	
}

var getTile = function(x, y, id) {
	if(211<=id && id<=250)
	{
		t = new MovingTile(x,y,id)
		MovingTile[id] = t;
		anyDown.push(false);
		return t;
	}
	if(61<=id && id<=210)
	{
		t = new invisibleTile(x,y,id)
		invisibleTile[id] = t;
		anyDown.push(false);
		return t;
	}
	if(49<id && id<60) {
		t = new LavaSwitchedTile(x, y)
		lavaswitchedTiles[id-20] = t;
		anyDown.push(false);
		return t;
	}
	else if(39<id && id<50) {
		return new LavaSwitchTile(x, y, id-10);
	}
	else if(19<id && id<30) {
		t = new SwitchedTile(x, y)
		switchedTiles[id-20] = t;
		anyDown.push(false);
		return t;
	}
	else if(9<id && id<20) {
		return new SwitchTile(x, y, id-10);
	}
	else {
		switch(id) {
			case 1:
				return new WallTile(x, y);
			case 2:
				return new VictoryTile(x, y);
			case 3:
				return new LavaTile(x, y);
			case 4: 
				return new PlayerWallTile(x, y);
			default:
				return new FloorTile(x, y);
		}
	}
}
