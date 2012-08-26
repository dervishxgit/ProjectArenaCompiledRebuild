//(c)opyright 2012 - Steve Miller

//firestorm is one of the possible effects instantiated by the weather system
//the firestorm should hang out and spawn projectiles

ig.module('game.entities.firestorm')
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

		refireTime: 0.25,

		playerRef: null, //watcher for player
		screenSpawnOffsetX: 0, //our offset amount to be calculated based on player and screen
		screenSpawnOffsetY: 0,

		randomSpawnX: 0,
		randomSpawnY: 0,

		init: function(x, y, settings) {
			this.parent(x, y, settings);

			this.fireTimer = new ig.Timer();

			this.getPlayerRef();

			this.setOffsetBasedOnScreen();
		},

		update: function() {

			this.rainFire();

			this.parent();
		},

		rainFire: function() {
			if (this.fireTimer.delta() > this.refireTime) {
				this.randomSpawnX = this.setRandomSpawnLoacationX();
				this.randomSpawnY = ig.game.screen.y;
				this.spawnFireBalls(1, this.randomSpawnX, this.randomSpawnY);
				this.fireTimer.set();
				console.log('rained fire');
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
			console.log(returnRandomX);
			return returnRandomX;

		},

		setOffsetBasedOnScreen: function() {
			//assumes a centered camera
			screenSpawnOffsetX = ig.system.width /2;
			screenSpawnOffsetY = ig.system.height /2;
		}


	});//eol firestorm
}); //eol defines