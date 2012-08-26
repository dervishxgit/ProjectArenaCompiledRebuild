//(c)opyright 2012 - Steve Miller

//firestorm is one of the possible effects instantiated by the weather system
//the firestorm should hang out and spawn projectiles

ig.module('game.entities.weatherentities')
.requires(
	'impact.entity',
	'game.entities.projectile'
	)
.defines(function(){
	EntityFirestorm = ig.Entity.extend({
		_wmIgnore: true,

		size: {x: 0, y:0},

		pos: {x: 0, y:0},

		name: 'firestorm',

		fireTimer : null,
		liveTimer: null,
		lifeTime: 60,

		refireTime: 0.25,

		playerRef: null, //watcher for player
		screenSpawnOffsetX: 0, //our offset amount to be calculated based on player and screen
		screenSpawnOffsetY: 0,

		randomSpawnX: 0,
		randomSpawnY: 0,

		init: function(x, y, settings) {
			this.parent(x, y, settings);
			if (settings.lifeTime) {
				this.lifeTime = settings.lifeTime;
			}

			this.fireTimer = new ig.Timer();
			this.liveTimer = new ig.Timer(this.lifeTime);

			this.getPlayerRef();

			this.setOffsetBasedOnScreen();
		},

		update: function() {

			this.rainFire();

			this.parent();

			this.checkCountDown();
		},

		rainFire: function() {
			if (this.fireTimer.delta() > this.refireTime) {
				this.randomSpawnX = this.setRandomSpawnLoacationX();
				this.randomSpawnY = ig.game.screen.y;
				this.spawnFireBalls(1, this.randomSpawnX, this.randomSpawnY);
				this.fireTimer.set();
				//console.log('rained fire');
			}

			
		},

		spawnFireBalls: function(numballs, positionx, positiony) {
			ig.game.spawnEntity(EntityFireball, positionx, positiony);			
		},

		getPlayerRef: function() {
			var player = ig.game.getEntitiesByType(EntityPlayer)[0];
				if (player) {
					this.playerRef = player;
				}
		},

		setRandomSpawnLoacationX: function() {
			//should give us a random positionX in the constraints of the current screen,
			//our y will always be the top of the screen
			var minX = ig.game.screen.x,
				maxX = ig.game.screen.x + ig.system.width;
				//minY = ig.game.screen.y,
				//maxY = ig.game.screen.y + ig.system.height.

			//random number between start of screen and end will be our x
			var returnRandomX = Math.floor((Math.random() * maxX) +minX);
			//console.log(returnRandomX);
			return returnRandomX;

		},

		setOffsetBasedOnScreen: function() {
			//assumes a centered camera
			screenSpawnOffsetX = ig.system.width /2;
			screenSpawnOffsetY = ig.system.height /2;
		},

		checkCountDown: function () {
			var countdowndelta = this.liveTimer.delta();
			//console.log(countdowndelta);
			if (countdowndelta >= 0) {
				//console.log('should kill');
				this.kill();
			}
		},

		draw: function() {
			this.drawCountdown();

			this.parent();
		},

		drawCountdown: function() {
			ig.game.font.draw('Firestorm Time Remaining:' + this.liveTimer.delta(), 2, 512);
		}


	});//eol firestorm

	EntityGravity = ig.Entity.extend({
		_wmIgnore: true,

		size: {x: 0, y:0},

		pos: {x: 0, y:0},

		name: 'gravity',

		liveTimer: null,
		lifeTime: 60,

		playerRef: null, //watcher for player

		///////////////////////////////////////////////////
		//states:
		//backup relevant player data
		//alter relevant player data
		//run timer, after timer expires then -
		//alter relevant player data back to original
		//destroy self

		currentState: 0,
		stateBackup: 0,
		stateAlterPlayer: 1,
		stateRunTimer: 2,
		stateRestorePlayer: 3,
		stateDestroy: 4,
//////////////////////////////////////////////////////////
//////////now we have to declare our storage for the relevant stats of the player
//////////related to this weather type

		relevantStats: {
			jump: null,
			gravityFactor: null

		},

		excludedTrait: null, //the trait of the player that grants them a free pass
							//should be feathery, or wieght false

		alterValues: {
			jump: 125,
			gravityFactor: 3

		},

		init: function(x, y, settings) {
			this.parent(x, y, settings);
			if (settings.lifeTime) {
				this.lifeTime = settings.lifeTime;
			}

			this.liveTimer = new ig.Timer(this.lifeTime);

			this.getPlayerRef();

			//this line is setting whether the player has a trait that will exclude them from being affected by the weather
			this.excludedTrait = this.checkExcludedTraitWeightFalse();
			console.log(this.excludedTrait);

		},

		update: function() {

			this.runGravity();

			this.parent();

			//this.checkCountDown();
		},

		runGravity: function() {
			//only run the weather on the player if they don't have the exclude trait that gives them immunity
			if (this.excludedTrait == false) {
				//run snow will be our state machine, this logic should extend to the other weather types as well
				if (this.currentState == this.stateBackup) {
					this.backupPlayerStats();
					console.log('finished state: ' + this.currentState);
					this.currentState = this.stateAlterPlayer;
				}
				else if (this.currentState == this.stateAlterPlayer) {
					this.alterPlayerStats();
					console.log('finished state: ' + this.currentState);
					this.currentState = this.stateRunTimer;
				} 
				else if (this.currentState == this.stateRunTimer) {
					//compare timer
					this.checkCountDown();

				}
				else if (this.currentState == this.stateRestorePlayer) {
					this.restorePlayerStats();
					console.log('finished state: ' + this.currentState);
					this.currentState = this.stateDestroy;
				}
				else if (this.currentState == this.stateDestroy) {
					console.log('finished state: ' + this.currentState);
					this.kill();
				}
			}
		},

		backupPlayerStats: function () {
			this.getPlayerRef();
			//copy values from player to our relevant stats
			this.relevantStats.jump = this.playerRef.jump;
			this.relevantStats.gravityFactor = this.playerRef.gravityFactor;
			console.log('backup was called');
		},

		alterPlayerStats: function () {
			this.getPlayerRef();
			//console.log(this.alterValues);
			//this.playerRef.setUnderTheWeather(true);
			this.playerRef.setJump(this.alterValues.jump);
			this.playerRef.setGravityFactor(this.alterValues.gravityFactor);
			console.log('alterplayerstats was called');
		},

		restorePlayerStats: function () {
			this.getPlayerRef();
			this.playerRef.setUnderTheWeather(false);
			this.playerRef.setJump(this.relevantStats.jump);
			this.playerRef.setGravityFactor(this.relevantStats.gravityFactor);
			console.log('restorePlayerStats was called');
		},

		checkExcludedTraitWeightFalse: function () {
			//be careful, this is really bad, but it's going to set the opposite of what it
			//finds in the player setting, this is because our logic for running the weather
			//is different from the design of the player traits (should never have been goddam
				//true false in the first place but here we are)
			if (this.playerRef.weight == false) {
				return true;
			} else {return false;}
		}, 

		getPlayerRef: function() {
			var player = ig.game.getEntitiesByType(EntityPlayer)[0];
				//if (player) {
					this.playerRef = player;
				//}
		},

		checkCountDown: function () {
			var countdowndelta = this.liveTimer.delta();
			if (countdowndelta >= 0) {
				//this.kill();
				this.currentState = this.stateRestorePlayer;
			} else {
				//nothing
			}
		},

		draw: function() {
			this.drawCountdown();

			this.parent();
		},

		drawCountdown: function() {
			ig.game.font.draw('Gravity Time Remaining:' + this.liveTimer.delta(), 2, 512);
		}

	});//eol gravity

	EntityWind = ig.Entity.extend({

		//wind is going to be a little different,
		//should decide, after a time, which way the wind is going to blow,
		//then subtract from player's velocity accordingly

		_wmIgnore: true,

		size: {x: 0, y:0},

		pos: {x: 0, y:0},

		name: 'wind',

		liveTimer: null,
		lifeTime: 60,
		windChangeDirectionTimer: null,
		windChangeDirectionInterval: null,
		windDirection: {x: null, y: null}, //will be expressed as purely x to start, possibly y if appropriate
		windSpeed: 300, //velocity adjustment amount


		playerRef: null, //watcher for player

		///////////////////////////////////////////////////
		//states:
		//backup relevant player data
		//alter relevant player data
		//run timer, after timer expires then -
		//alter relevant player data back to original
		//destroy self

		currentState: 2,
		//stateBackup: 0,
		//stateAlterPlayer: 1,
		stateRunTimer: 2,
		//stateRestorePlayer: 3,
		stateDestroy: 4,
//////////////////////////////////////////////////////////
//////////now we have to declare our storage for the relevant stats of the player
//////////related to this weather type

		/*relevantStats: {
			friction: {x: null, y: null},
			maxVel: {x: null, y: null}

		},*/

		excludedTrait: null, //the trait of the player that grants them a free pass
							//should be cornfed, or physique true

		/*alterValues: {
			friction: {x: 50, y: 0},
			maxVel: {x: 240, y: 1000}

		},*/

		init: function(x, y, settings) {
			this.parent(x, y, settings);
			if (settings.lifeTime) {
				this.lifeTime = settings.lifeTime;
			}

			this.liveTimer = new ig.Timer(this.lifeTime);
			this.windChangeDirectionTimer = new ig.Timer();

			this.getPlayerRef();

			//this line is setting whether the player has a trait that will exclude them from being affected by the weather
			this.excludedTrait = this.checkExcludedTraitWeightTrue();
			console.log(this.excludedTrait);

			//get a new interval
			this.randomWindInterval();
			//get new random windDirection
			this.randomWindDirection();
			//reset our timer
			this.windChangeDirectionTimer.set(this.windChangeDirectionInterval);

		},

		update: function() {

			this.runWind();

			this.parent();

			//this.checkCountDown();
		},

		randomWindInterval: function() {
			//will set wind interval somewhere between 1 and 10 each time
			var newinterval = Math.floor((Math.random() * 10) + 1);
			this.windChangeDirectionInterval = newinterval;
		},

		randomWindDirection: function() {
			//will randomize wind direction
			var x = Math.random();
			var y = Math.random();
			if (x > 0.5) {
				x = 1;
			} else {x = -1;}

			if (y > 0.5){
				y = 1;
			} else {y = -1;}

			this.windDirection.x = x;
			this.windDirection.y = y;
		},

		applyWindToPlayer: function() {
			//store player vel
			var pvelx = this.playerRef.vel.x;
			var pvely = this.playerRef.vel.y;

			var windX = this.windDirection.x * this.windSpeed;
			var windY = this.windDirection.y * this.windSpeed;

			var adjustedVelX = windX - pvelx;

			this.playerRef.vel.x =  adjustedVelX;
			//this.playerRef.vel.y = pvely + windY;

		},

		runWind: function() {
			//only run the weather on the player if they don't have the exclude trait that gives them immunity
			//if (this.excludedTrait == false) {
				//run snow will be our state machine, this logic should extend to the other weather types as well
				/*if (this.currentState == this.stateBackup) {
					this.backupPlayerStats();
					console.log('finished state: ' + this.currentState);
					this.currentState = this.stateAlterPlayer;
				}
				else if (this.currentState == this.stateAlterPlayer) {
					this.alterPlayerStats();
					console.log('finished state: ' + this.currentState);
					this.currentState = this.stateRunTimer;
				} 
				else*/ if (this.currentState == this.stateRunTimer) {
					//see if our change direction timer is up
					var windchangedelta = this.windChangeDirectionTimer.delta();
					if (windchangedelta >= 0) {
						//time to change so
						//get a new interval
						this.randomWindInterval();
						//get new random windDirection
						this.randomWindDirection();
						//reset our timer
						this.windChangeDirectionTimer.set(this.windChangeDirectionInterval);
					}
					else {
						this.applyWindToPlayer();
					}

					//compare timer
					this.checkCountDown();

				}
				/*else if (this.currentState == this.stateRestorePlayer) {
					this.restorePlayerStats();
					console.log('finished state: ' + this.currentState);
					this.currentState = this.stateDestroy;
				}*/
				else if (this.currentState == this.stateDestroy) {
					console.log('finished state: ' + this.currentState);
					this.kill();
				}
			//}
		},

		backupPlayerStats: function () {
			this.getPlayerRef();
			//copy values from player to our relevant stats
			this.relevantStats.friction.x = this.playerRef.friction.x;
			this.relevantStats.friction.y = this.playerRef.friction.y;
			this.relevantStats.maxVel.x = this.playerRef.maxVel.x;
			this.relevantStats.maxVel.y = this.playerRef.maxVel.y;
			console.log('backup was called');
		},

		alterPlayerStats: function () {
			this.getPlayerRef();
			//console.log(this.alterValues);
			this.playerRef.setUnderTheWeather(true);
			this.playerRef.setFriction(this.alterValues.friction.x, this.alterValues.friction.y);
			this.playerRef.setMaxVel(this.alterValues.maxVel.x, this.alterValues.maxVel.y);
			console.log('alterplayerstats was called');
		},

		restorePlayerStats: function () {
			this.getPlayerRef();
			this.playerRef.setUnderTheWeather(false);
			this.playerRef.setFriction(this.relevantStats.friction.x, this.relevantStats.friction.y);
			this.playerRef.setMaxVel(this.relevantStats.maxVel.x, this.relevantStats.maxVel.y);
			console.log('restorePlayerStats was called');
		},

		checkExcludedTraitWeightTrue: function () {
			if (this.playerRef.weight == true) {
				return true;
			} else {return false;}
		}, 

		getPlayerRef: function() {
			var player = ig.game.getEntitiesByType(EntityPlayer)[0];
				//if (player) {
					this.playerRef = player;
				//}
		},

		checkCountDown: function () {
			var countdowndelta = this.liveTimer.delta();
			if (countdowndelta >= 0) {
				//this.kill();
				this.currentState = this.stateRestorePlayer;
			} else {
				//nothing
			}
		},

		draw: function() {
			this.drawCountdown();

			this.parent();
		},

		drawCountdown: function() {
			ig.game.font.draw('Snow Time Remaining:' + this.liveTimer.delta(), 2, 512);
		}

	});//eol wind

	EntitySnow = ig.Entity.extend({
		_wmIgnore: true,

		size: {x: 0, y:0},

		pos: {x: 0, y:0},

		name: 'snow',

		liveTimer: null,
		lifeTime: 60,

		playerRef: null, //watcher for player


///////////////////////////////////////////////////
		//states:
		//backup relevant player data
		//alter relevant player data
		//run timer, after timer expires then -
		//alter relevant player data back to original
		//destroy self

		currentState: 0,
		stateBackup: 0,
		stateAlterPlayer: 1,
		stateRunTimer: 2,
		stateRestorePlayer: 3,
		stateDestroy: 4,
//////////////////////////////////////////////////////////
//////////now we have to declare our storage for the relevant stats of the player
//////////related to this weather type

		relevantStats: {
			friction: {x: null, y: null},
			maxVel: {x: null, y: null}

		},

		excludedTrait: null, //the trait of the player that grants them a free pass
							//should be cornfed, or physique true

		alterValues: {
			friction: {x: 50, y: 0},
			maxVel: {x: 240, y: 1000}

		},

		init: function(x, y, settings) {
			this.parent(x, y, settings);
			if (settings.lifeTime) {
				this.lifeTime = settings.lifeTime;
			}

			this.liveTimer = new ig.Timer(this.lifeTime);

			this.getPlayerRef();

			//this line is setting whether the player has a trait that will exclude them from being affected by the weather
			this.excludedTrait = this.checkExcludedTraitPhysiqueTrue();
			console.log(this.excludedTrait);

		},

		update: function() {

			this.runSnow();

			this.parent();
		},

		runSnow: function() {
			//only run the weather on the player if they don't have the exclude trait that gives them immunity
			if (this.excludedTrait == false) {
				//run snow will be our state machine, this logic should extend to the other weather types as well
				if (this.currentState == this.stateBackup) {
					this.backupPlayerStats();
					console.log('finished state: ' + this.currentState);
					this.currentState = this.stateAlterPlayer;
				}
				else if (this.currentState == this.stateAlterPlayer) {
					this.alterPlayerStats();
					console.log('finished state: ' + this.currentState);
					this.currentState = this.stateRunTimer;
				} 
				else if (this.currentState == this.stateRunTimer) {
					//compare timer
					this.checkCountDown();

				}
				else if (this.currentState == this.stateRestorePlayer) {
					this.restorePlayerStats();
					console.log('finished state: ' + this.currentState);
					this.currentState = this.stateDestroy;
				}
				else if (this.currentState == this.stateDestroy) {
					console.log('finished state: ' + this.currentState);
					this.kill();
				}
			}
		},

		backupPlayerStats: function () {
			this.getPlayerRef();
			//copy values from player to our relevant stats
			this.relevantStats.friction.x = this.playerRef.friction.x;
			this.relevantStats.friction.y = this.playerRef.friction.y;
			this.relevantStats.maxVel.x = this.playerRef.maxVel.x;
			this.relevantStats.maxVel.y = this.playerRef.maxVel.y;
			console.log('backup was called');
		},

		alterPlayerStats: function () {
			this.getPlayerRef();
			//console.log(this.alterValues);
			this.playerRef.setUnderTheWeather(true);
			this.playerRef.setFriction(this.alterValues.friction.x, this.alterValues.friction.y);
			this.playerRef.setMaxVel(this.alterValues.maxVel.x, this.alterValues.maxVel.y);
			console.log('alterplayerstats was called');
		},

		restorePlayerStats: function () {
			this.getPlayerRef();
			this.playerRef.setUnderTheWeather(false);
			this.playerRef.setFriction(this.relevantStats.friction.x, this.relevantStats.friction.y);
			this.playerRef.setMaxVel(this.relevantStats.maxVel.x, this.relevantStats.maxVel.y);
			console.log('restorePlayerStats was called');
		},

		checkExcludedTraitPhysiqueTrue: function () {
			if (this.playerRef.physique == true) {
				return true;
			} else {return false;}
		}, 

		getPlayerRef: function() {
			var player = ig.game.getEntitiesByType(EntityPlayer)[0];
				//if (player) {
					this.playerRef = player;
				//}
		},

		checkCountDown: function () {
			var countdowndelta = this.liveTimer.delta();
			if (countdowndelta >= 0) {
				//this.kill();
				this.currentState = this.stateRestorePlayer;
			} else {
				//nothing
			}
		},

		draw: function() {
			this.drawCountdown();

			this.parent();
		},

		drawCountdown: function() {
			ig.game.font.draw('Snow Time Remaining:' + this.liveTimer.delta(), 2, 512);
		}

	});//eol snow
}); //eol defines