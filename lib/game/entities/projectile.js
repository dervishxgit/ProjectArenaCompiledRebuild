//(c)opyright  2012 - Steve Miller

//this will define our projectile. the base class is designed to be empty and non interactive
//inheriting classes will have their own enabling values

ig.module(
	'game.entities.projectile'
	)
.requires(
	'impact.entity',
	'impact.game',
	'game.data.projectileLib'
	)
.defines(function(){

	EntityProjectile = ig.Entity.extend({
		//all attributes will be overwritten by inheriting classes
		//animSheet: new ig.AnimationSheet('media/slime-grenade.png', 8, 8), //yes our base has an animsheet, for testing purposes
		//animSheet: new ig.AnimationSheet('media/testPlayerLarger02.png', 25, 25), //yes our base has an animsheet, for testing purposes

		//size: {x: 25, y: 25}, //large size for testing
		//offset: {x: 0, y:0},
		//flip: false,

		//maxVel: {x: 200, y: 200},
		//friction: {x: 20, y: 20},
		//accelGround: 100,
		//accelAir: 100,

		_wmIgnore: true,

		//gravityFactor: 0, //we are pretty sure the projectiles will not need to fall, but if they do then set this to 1
		type: ig.Entity.TYPE.NONE, //none for now, base is as generic as possible
		//type: ig.Entity.TYPE.A,
		checkAgainst: ig.Entity.TYPE.NONE, //same as above, this default will not hurt anyone
		//checkAgainst: ig.Entity.TYPE.B,
		collides: ig.Entity.COLLIDES.NEVER, //default does not collide, is visual
		//collides: ig.Entity.COLLIDES.PASSIVE,

		//tested variables
		lifeTime:null ,
		lifeTimer: null,
		travelDirectionX: 1, //1 or -1 to multiply the velocity
		bWatchSpawnerPosition: false, //a value that will have an additional positional update based on the entity that spawned the projectile
		referenceSpawner: null,
		offsetSpawnOrigin: {x: 0, y:0},
		//variables to be tested
		
		
		
		posSpawner: {x: 0, y:0},
		//startposition: {x: ig.system.width /2, y: ig.system.height /2},
		
		bNoDraw: false, //should this projectile be drawn?

		damage: 0,

		checkTimer: null,
		checkTimerInterval: null,
		checkFlag: false,

		init: function(x, y, settings) {
			this.parent(x, y, settings);
			//future extended classes will inherit more on init

			//to be moved after testing//
			//this.addAnim('default', 1.0, [0,1]);
			this.setLifeTimeAndTimer(settings.lifeTime);

			//spawner specific
			this.bWatchSpawnerPosition = settings.bWatchSpawnerPosition;
			if (this.bWatchSpawnerPosition){
				this.referenceSpawner = settings.referenceSpawner;
				this.offsetSpawnOrigin.x = settings.offsetSpawnOrigin.x;
				this.offsetSpawnOrigin.y = settings.offsetSpawnOrigin.y;
				/*this.posSpawner.x = this.referenceSpawner.pos.x;
				this.posSpawner.y = this.referenceSpawner.pos.y;*/
			}
			

			//set flip according to spawner
			this.setFlip(settings.flip);
			//set travel direction if spawner is flipped
			this.setTravelDirectionOnFlip();

			//set the x velocity of our projectile
			this.setVelocityX();

			//this.sendOutMessage('serverInitializeNetProjectile');
			
		},

		check: function( other ) {
			//if (other.name == 'otherplayer') {
				if (this.checkFlag) {
					return;
				}
				else if (!this.checkFlag) {
					other.receiveDamage(this.damage, this);
					this.checkFlag = true;				
				}
			//}
		},

		collideWith: function( other, axis) {

		},

		draw: function () {
			if (this.bNoDraw == true) {
				return;
			}
			this.parent();
		},


		

		update: function(){

			//all projectiles should have a lifetime that expires over time
			this.tickLifeTimer();
			this.checkLifeTimer();

			this.updatePosOnSpawner();


			
			//last
			this.parent();
		},

		//additional functions

		//SETTINGS LOAD FUNCTION
		loadSettings: function(settings) {

		},


		//LIFETIME FUNCTIONS
		setLifeTimeAndTimer: function(lifeTimeValue) {
			this.lifeTime = lifeTimeValue;
			this.lifeTimer = this.lifeTime;
		},

		tickLifeTimer: function(){
			this.lifeTimer -= 1;
		},

		checkLifeTimer: function() {
			if (this.lifeTimer < 1) {
				this.kill();
				//console.log('projectile dead: ' + this.id);
			}
		},

		//POSITION AND MOVEMENT
		updatePosOnSpawner: function() {
			if (this.bWatchSpawnerPosition){
				//update / adjust position based on mobile spawner (player)
				//not sure how to do this without references / pointers
				if (this.flip) {
					this.pos.x = this.referenceSpawner.pos.x - this.size.x;
				} else if (!this.flip) {
					this.pos.x = this.referenceSpawner.pos.x + this.offsetSpawnOrigin.x;
				}
				this.pos.y = this.referenceSpawner.pos.y;
				//console.log('updatePosOnSpawner was called');
				//console.log()
			}

		},



		//
		setVelocityX: function() {
			this.vel.x = this.maxVel.x * this.travelDirectionX;
		},

		setFlip: function(flipstate) {
			this.flip = flipstate;
		},

		setTravelDirectionOnFlip: function() {
			//the flip state of the spawner, affects direction of projectile
			if (this.flip == true) {
				this.travelDirectionX = -1;
			}
		},

		sendOutMessage: function(string) {
			//outgoing message
			socket.emit(string /*,args*/);
		}


	});//line end for entity definition
	
	EntityBasicpunch = EntityProjectile.extend({

		//all attributes will be overwritten by inheriting classes
		//animSheet: new ig.AnimationSheet('media/slime-grenade.png', 8, 8), //yes our base has an animsheet, for testing purposes
		animSheet: new ig.AnimationSheet('media/testPlayerLarger02.png', 25, 25), //yes our base has an animsheet, for testing purposes

		size: {x: 25, y: 25}, //large size for testing
		offset: {x: 0, y:0},
		flip: false,

		//maxVel: {x: 200, y: 200},
		//friction: {x: 20, y: 20},
		//accelGround: 100,
		//accelAir: 100,


		gravityFactor: 0, //we are pretty sure the projectiles will not need to fall, but if they do then set this to 1
		//type: ig.Entity.TYPE.NONE, //none for now, base is as generic as possible
		type: ig.Entity.TYPE.NONE,
		//checkAgainst: ig.Entity.TYPE.NONE, //same as above, this default will not hurt anyone
		checkAgainst: ig.Entity.TYPE.BOTH,
		collides: ig.Entity.COLLIDES.NEVER, //default does not collide, is visual
		//collides: ig.Entity.COLLIDES.PASSIVE,

		//tested variables
		lifeTime:30 ,
		lifeTimer: null,
		travelDirectionX: 1, //1 or -1 to multiply the velocity
		bWatchSpawnerPosition: false, //a value that will have an additional positional update based on the entity that spawned the projectile
		referenceSpawner: null,
		offsetSpawnOrigin: {x: 0, y:0},
		//variables to be tested
		
		
		
		posSpawner: {x: 0, y:0},
		//startposition: {x: ig.system.width /2, y: ig.system.height /2},
		
		bNoDraw: false, //should this projectile be drawn?

		damage: 20,

		init: function(x, y, settings) {
			this.parent(x, y, settings);
			//future extended classes will inherit more on init

			//to be moved after testing//
			this.addAnim('default', 1.0, [0,1]);
			this.setLifeTimeAndTimer(settings.lifeTime);

			//spawner specific
			this.bWatchSpawnerPosition = settings.bWatchSpawnerPosition;
			if (this.bWatchSpawnerPosition){
				this.referenceSpawner = settings.referenceSpawner;
				this.offsetSpawnOrigin.x = settings.offsetSpawnOrigin.x;
				this.offsetSpawnOrigin.y = settings.offsetSpawnOrigin.y;
				/*this.posSpawner.x = this.referenceSpawner.pos.x;
				this.posSpawner.y = this.referenceSpawner.pos.y;*/
			}
			

			//set flip according to spawner
			this.setFlip(settings.flip);
			//set travel direction if spawner is flipped
			this.setTravelDirectionOnFlip();

			//set the x velocity of our projectile
			this.setVelocityX();

			this.sendOutMessage('serverInitializeNetProjectile');
			
		},

		check: function( other ) {
			//console.log(other);
			if (this.checkFlag) {
					return;
			}
			else if (!this.checkFlag) {
				other.receiveDamage(this.damage, this);
				this.checkFlag = true;				
			}
			//console.log('punch checked');
		},

		collideWith: function( other, axis) {

		},

		draw: function () {
			if (this.bNoDraw == true) {
				return;
			}
			this.parent();
		},


		

		update: function(){

			//all projectiles should have a lifetime that expires over time
			this.tickLifeTimer();
			this.checkLifeTimer();

			this.updatePosOnSpawner();


			
			//last
			this.parent();
		},

		//additional functions

		//SETTINGS LOAD FUNCTION
		loadSettings: function(settings) {

		},


		//LIFETIME FUNCTIONS
		setLifeTimeAndTimer: function(lifeTimeValue) {
			this.lifeTime = lifeTimeValue;
			this.lifeTimer = this.lifeTime;
		},

		tickLifeTimer: function(){
			this.lifeTimer -= 1;
		},

		checkLifeTimer: function() {
			if (this.lifeTimer < 1) {
				this.kill();
			}
		},

		//POSITION AND MOVEMENT
		updatePosOnSpawner: function() {
			if (this.bWatchSpawnerPosition){
				//update / adjust position based on mobile spawner (player)
				//not sure how to do this without references / pointers
				if (this.flip) {
					this.pos.x = this.referenceSpawner.pos.x - this.size.x;
				} else if (!this.flip) {
					this.pos.x = this.referenceSpawner.pos.x + this.offsetSpawnOrigin.x;
				}
				this.pos.y = this.referenceSpawner.pos.y;

			}

		},

		//
		setVelocityX: function() {
			this.vel.x = this.maxVel.x * this.travelDirectionX;
		},

		setFlip: function(flipstate) {
			this.flip = flipstate;
		},

		setTravelDirectionOnFlip: function() {
			//the flip state of the spawner, affects direction of projectile
			if (this.flip == true) {
				this.travelDirectionX = -1;
			}
		},

		sendOutMessage: function(string) {
			//outgoing message
			socket.emit(string /*,args*/);
		}


	

	});//line end entity basicpunch

	EntityProjectilenetcopy = EntityProjectile.extend({
		animSheet: new ig.AnimationSheet('media/testPlayerLarger.png', 25, 25),

		size: {x: 25, y:25},
		flip: false,
		gravityFactor: 0,
		//type: ig.Entity.TYPE.NONE,
		type: ig.Entity.TYPE.NONE,
		//checkAgainst: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.NEVER,
		//collides: ig.Entity.COLLIDES.PASSIVE,

		lifeTime: 30,
		lifeTimer: null,

		travelDirectionX: 1,
		bWatchSpawnerPosition: false,
		referenceSpawner: null,
		offsetSpawnOrigin: {x: 0, y:0},

		posSpawner: {x: 0, y:0},

		bNoDraw: false,

		damage: 20,

		init: function(x, y, settings) {
			/*this.parent(x, y, settings);
			this.lifeTime = settings.lifeTime;
			//this.lifeTimer = 10;

			//this.pos.x = x;
			//this.pos.y = y;

			//spawner specific
			this.bWatchSpawnerPosition = settings.bWatchSpawnerPosition;
			if (this.bWatchSpawnerPosition){
				this.referenceSpawner = settings.referenceSpawner;
				this.offsetSpawnOrigin.x = settings.offsetSpawnOrigin.x;
				this.offsetSpawnOrigin.y = settings.offsetSpawnOrigin.y;
				//this.posSpawner.x = ig.game.playerList.thisPlayer.pos.x;
			}*/

			//outgoing message example, should be in original projectile
			//socket.emit('serverInitializeNetProjectile' /*,args*/);
			console.log(x, y, settings);
			this.parent(x, y, settings);
			//future extended classes will inherit more on init

			//to be moved after testing//
			this.addAnim('default', 1.0, [0,1]);
			this.setLifeTimeAndTimer(settings.lifeTime);

			//spawner specific
			this.bWatchSpawnerPosition = settings.bWatchSpawnerPosition;
			if (this.bWatchSpawnerPosition){
				this.referenceSpawner = settings.referenceSpawner;
				this.offsetSpawnOrigin.x = settings.offsetSpawnOrigin.x;
				this.offsetSpawnOrigin.y = settings.offsetSpawnOrigin.y;
				/*this.posSpawner.x = this.referenceSpawner.pos.x;
				this.posSpawner.y = this.referenceSpawner.pos.y;*/
			}
			

			//set flip according to spawner
			this.setFlip(settings.flip);
			//set travel direction if spawner is flipped
			this.setTravelDirectionOnFlip();

			//set the x velocity of our projectile
			this.setVelocityX();
			//console.log('net projectile' + this.lifeTime);
			//console.log('should see this once');
			/*var reftest = this.referenceSpawner;
			console.log(reftest);
			console.log(this.referenceSpawner.pos.x, this.referenceSpawner.pos.y);
			console.log(reftest.pos.x, reftest.pos.y);
			console.log(this.pos.x, this.pos.y);*/
		},

		check: function(other) {
			if (this.checkFlag) {
					return;
				}
				else if (!this.checkFlag) {
					other.receiveDamage(this.damage, this);
					this.checkFlag = true;				
				}
		},

		draw: function() {
			this.parent();
		},

		update: function() {
			//all projectiles should have a lifetime that expires over time
			this.tickLifeTimer();
			this.checkLifeTimer();

			this.updatePosOnSpawner();


			
			//last
			this.parent();
		},

		updatePosOnSpawner: function() {
			if (this.bWatchSpawnerPosition){
				//update / adjust position based on mobile spawner (player)
				//not sure how to do this without references / pointers
				if (this.flip) {
					this.pos.x = this.referenceSpawner.pos.x - this.size.x;
				} else if (!this.flip) {
					this.pos.x = this.referenceSpawner.pos.x + this.offsetSpawnOrigin.x;
				}
				this.pos.y = this.referenceSpawner.pos.y;

			}

		},

	});//line end netprojectilecopy

	EntityFireball = EntityProjectile.extend({
		size: {x: 50, y: 50},

		maxVel: {x: 0, y: 1000},

		vel: {x: 0, y: 500},

		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.BOTH,
		collides: ig.Entity.COLLIDES.PASSIVE,

		animSheet: new ig.AnimationSheet('media/fireball.png', 50, 50),

		damage: 10,

		gravityFactor: 5,

		checkTimer: null,
		bCheckedFlag: false,
		checkInterval: 1.0,

		init: function (x, y, settings) {
			this.lifeTime = 3;


			this.parent(x, y, settings);
			this.addAnim('fall', 0.5, [0,1]);

			this.checkTimer = new ig.Timer();
			this.checkTimer.set();
		},

		update: function() {
			if (this.vel.y > 0) {
				this.currentAnim = this.anims.fall;
			}

			this.parent();
		},

		/*collideWith: function(other, axis) {
			other.receiveDamage(this.damage);
			//this.parent(other, axis);

		},*/

		check: function(other) {

			if (this.checkTimer.delta() > this.checkInterval) {
				this.bCheckedFlag = false;
				this.checkTimer.set();
			}
			if(this.bCheckedFlag) {
				return;
			}else if (!this.bCheckedFlag){
				other.receiveDamage(this.damage);
				this.bCheckedFlag = true;
			}
		},

		collideWith: function(other, axis) {
			this.kill();
		}


	});//eol fireball
}); //line end for module
