ig.module(
	'game.entities.turret'
)
.requires(
	'impact.entity',
    'game.entities.projectile'
)
.defines(function () {

	var testPunchSettings = {
		flip: false,
		bWatchSpawnerPosition: true,
		referenceSpawner: null,
		lifeTime: 100
	};
	
	var animSet = false;
	var CurrentState = 1;
	var STATE_NORMAL = 1;
	
	var countStep = 0;
	var countBool = false;
	
	EntityTurret = ig.Entity.extend({
		
		size: { x: 75, y: 75},
		
		name: "turret",
		gamename: "",
		
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.PASSIVE, 
		//changed to fixed for the purpose of a stationary turret
		//hoping to have the player collide and not move past it
		
		animSheet: new ig.AnimationSheet('media/Turret.png', 74, 75),
		
		// These are our own properties. They are not defined in the base
        // ig.Entity class. We just use them internally for the Player
		health: 10,
		attackDamage: 1,
		
		init: function (x, y, settings) {
			this.parent(x, y, settings);

			this.addAnim('idle', .2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
			this.addAnim('west', 1, [0]);
			this.addAnim('westNorthWest', 1, [1]);
			this.addAnim('northWest', 1, [2]);
			this.addAnim('northNorthWest', 1, [3]);
			this.addAnim('north', 1, [4]);
			this.addAnim('north_flip', 1, [5]);
			this.addAnim('northNorthEast', 1, [6]);
			this.addAnim('northEast', 1, [7]);
			this.addAnim('EastNorthWest', 1, [8]);
			this.addAnim('East', 1, [9]);
			
			testPunchSettings.referenceSpawner = this;
		},
		
		targetUpdate: function(){
			
		},
		
		update: function() {
			this.cuurentAnim = this.anims.idle;
			
			this.parent();
		},
	});
});