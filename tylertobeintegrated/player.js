ig.module(
	'game.entities.player'
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
	var CURRENT_STATE = 1;
	var STATE_NORMAL = 1;
	var STATE_DODGE = 2;
	var STATE_PUNCH = 3;
	var STATE_DUCK = 4;
	var STATE_PAIN = 5;
	
    EntityPlayer = ig.Entity.extend({

        // The players (collision) size is a bit smaller than the animation
        // frames, so we have to move the collision box a bit (offset)
        size: { x: 100, y: 100 },
		offset: {x: 50, y: 100},
        //offset: {x: 4, y: 2},

        maxVel: { x: 400, y: 1000 },
		//maxVel: {x: 600, y: 1000}, test numbers that I used to make the character move faster, not necessary 
        //maxVel: {x: 100, y: 200},
        friction: { x: 4000, y: 0 },

        type: ig.Entity.TYPE.A, // Player friendly group
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.PASSIVE,

        //animSheet: new ig.AnimationSheet( 'media/playerLarge.png', 32, 48 ),	
        animSheet: new ig.AnimationSheet('media/Wood_spritesheet.png', 200, 200),
		//animSheet: new ig.AnimationSheet('media/Wood_spritesheet_halfsize.png', 100, 100),

        // These are our own properties. They are not defined in the base
        // ig.Entity class. We just use them internally for the Player
        flip: false,
        accelGround: 1600,
        accelAir: 4000,
        jump: 500,
		armor: 0,
        candoublejump: false,
		duckedstate : false,
        dodgetimer: 2,				// dodge timer, used to initiate the dodge mechanic
        dodgecooldown: 30,			// cooldown timer, time before it dodge is available. Right now it's reall short.
		dodgedistance: 50,
		
		health: 10,
		attackDamage: 1,
		damageResist: 0,

        name: "player",
        gamename: playername,

        messagebox: "",
        messageboxtimer: 0,

        nettimer: 10,
		
        init: function (x, y, settings) {
            this.parent(x, y, settings);
			
			//animation initialization function ... see below
			this.initAnim();

            //add ourself to the game's player list
            //ig.game.playerList.thisPlayer = this;

            //set self as the spawner in testPunchSettings
            //testPunchSettings.referenceSpawner = this;

            //broadcast player init to all other players so that they run a clone
            socket.emit('initializeplayer', this.gamename);

        },
		
		//overloaded init function to allow different types of players based on the last three conditions
		// and the use of different sprites based on the 4th variable
		init: function(x, y, settings, spriteChoice, weight, tactility, physique){
			this.parent(x, y, settings);
			
			if(weight){
				this.setAcceleration(this.accelGround, 2000);
				this.setJump(250);
			}
			else{
				this.setAcceleration(this.accelGround, 4000);
				this.setJump(500);
			}
			
			if(tactility){
				this.setAttackDamage(3);
			}
			else{
				this.setAttackDamage(1);
			}
			
			if(physique){
				this.setHealth(20);
				this.setDamageResist(0);
			}
			else{
				this.setHealth(10);
				this.setDamageResist(10);
			}
			
			//initialize Animations function
			this.initAnim();
			
			//add ourself to the game's player list
			//ig.game.playerList.thisPlayer = this;
			
			//set self as the spawner in the testPunchSettings
			//testPunchSettings.referenceSpawner = this;
			
			//broadcast player init to all other players so that they run a clone
			socket.emit('initializeplayer', this.gamename);
		},			
		
		//function to allow the adding of animation that will not be in the main init function
		initAnim: function(){
		
			// sets all the animation states for the player, currently using a test sprite
   			this.addAnim( 'run', 0.16, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] );
			this.addAnim( 'idle', 0.16, [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23] );
			this.addAnim( 'swingattack', .66, [24, 25, 26, 27] ); //not implemented
			this.addAnim( 'punchattack', .16, [28, 29, 30, 31] ); //not implemented
			this.addAnim( 'swingattackreverse', .66, [98, 99, 100, 101] ); //not implemented
			this.addAnim( 'punchattackreverse', .66, [102, 103, 104, 105] ); //not implemented
			this.addAnim( 'pain', .66, [32, 33, 34, 35] ); //not implemented
			this.addAnim( 'block', .5, [36, 37, 38] ); //not implemented
			this.addAnim( 'dodge', .5, [39, 40, 41] ); //not implemented
			this.addAnim( 'duckstart', .16, [42, 43, 44] ); //implemented, but needs work
			this.addAnim( 'ducked', .16, [44]);
			this.addAnim( 'duckend', .16, [43,44]);
			this.addAnim( 'duckattack', .66, [45, 46, 47, 48] ); //implemented, needs more work
			this.addAnim( 'jump', .5, [49, 50, 51] ); 
			this.addAnim( 'idleairidle', .5, [52, 53, 54] );
			this.addAnim( 'idledoublejump', .5, [55, 56, 57] );
			this.addAnim( 'forwardjump', .5, [58, 59, 60] );
			this.addAnim( 'forwardairidle', .5, [61, 62, 63] );
			this.addAnim( 'forwarddoublejump', .5, [64, 65, 66] );
			this.addAnim( 'backwardjump', .5, [67, 68, 69] ); //not implemented
			this.addAnim( 'backwardairidle', .5, [70, 71, 72] ); //not implemented
			this.addAnim( 'backwarddoublejump', .5, [73, 74, 75] ); //not implemented
			this.addAnim( 'fall', .5, [76, 77, 78] );
			this.addAnim( 'airdodge', .5, [79, 80, 81] ); //not implemented
			this.addAnim( 'victory', 1.33, [82, 83, 84, 85, 86, 87, 88, 89] ); //not implemented
			this.addAnim( 'death', 1.33, [90, 91, 92, 93, 94, 95, 96, 97] ); //not implemented
		},
		
		//overloaded recieve damage function to allow for the pain animation to play		
		receiveDamage: function( amount, from, paintrigger ) {
			this.health -= amount;
			if( this.health <= 0 ) {
				this.kill();
			}
			if(paintrigger){
				this.anims.pain;
			}
		},

		updateAnim: function () {
			
			// set the current animation, based on the player's speed
			if (this.vel.y < 0) {
				this.currentAnim = this.anims.jump;
			}
			else if (this.vel.y > 0) {
				this.currentAnim = this.anims.fall;
			}
			
			//all the current conditions that are related to jumping  
			if (this.vel.x != 0 && this.vel.y < 0) {
				this.currentAnim = this.anims.forwardjump;
			}
			
			if (this.vel.x != 0 && this.vel.y == 0){
				this.currentAnim = this.anims.run;
			}
			
			if (this.vel.y == 0 && this.vel.x == 0) {
					this.currentAnim = this.anims.idle;
				}
			
			if(this.candoublejump == true){
				if (this.vel.y < 0 && this.vel.x == 0) {
					this.currentAnim = this.anims.idledoublejump;
				}
				if (this.vel.y < 0 && this.vel.x != 0){
					this.currentAnim = this.anims.forwarddoublejump;
				}
			}
			
			if (CURRENT_STATE == STATE_DODGE){
				this.currentAnim = this.anims.dodge;
			}
			
			if (CURRENT_STATE == STATE_PUNCH){
				this.currentAnim = this.anims.punchattack;
			}
			
			if (CURRENT_STATE == STATE_DUCK){
				if(this.duckedstate)
				{
					this.anims.duckstart;
					this.duckstate = true;
				}
				else if(ig.input.pressed('shoot')){	// this is supposed to be the ducked punching mechanic currenlty plays one frame and
					this.anims.duckattack;			// then switches back to normal ducked animation
				}
				else{
					this.currentAnim = this.anims.ducked;
				}
			}
		},
		
		//resets the variables to original values
		// need to come back and change these to a variable structure when
		// implementing character traits
		reset: function() {
			this.setMaxVel(400, 1000);
			this.setFriction(4000, 0);
			this.setAcceleration(1600, 4000);
		},
		
		dodge: function(){		
			if(this.flip == true){
				this.pos.x += 50;
			}
			else if (this.flip == false){
				this.pos.x -= 50;
			}
			this.CURRENT_STATE = this.STATE_NORMAL;
			this.reset();
			return;
		},

        update: function () {
			
			
			if(CURRENT_STATE == STATE_DUCK){
				if(ig.input.released('down')){
					this.duckedstate = false;
					CURRENT_STATE = STATE_NORMAL;
				}
				if(ig.input.pressed('shoot')){
					testPunchSettings.flip = this.flip;
					ig.game.spawnEntity(EntityProjectile, this.pos.x,
						this.pos.y, testPunchSettings);
					
				}
			}
			else if (CURRENT_STATE == STATE_NORMAL){
				/*
				// the counting down of the dodge cooldown system
				if (this.dodgecooldown >= 1) {
					this.dodgecooldown -= 1;
				}
				
				this.dodgetimer -= 1;
				if (this.dodgetimer <= 1) {
					this.leftdodgepressed01 = false;
					this.leftdodgepressed02 = false;
					this.rightdodgepressed01 = false;
					this.rightdodgepressed02 = false;
				}*/

				//reset certain conditions on ground (.standing state)
				if (this.standing == true) {
					this.candoublejump = false;
				}

				// move left or right
				var accel = this.standing ? this.accelGround : this.accelAir;
				if (ig.input.state('left')) {
					this.flip = true;
					this.accel.x = -accel;
					this.dodgetimer = 7;

				}
				else if (ig.input.state('right')) {
					this.flip = false;
					this.accel.x = accel;
					this.dodgetimer = 7;
				}
				else {
					this.accel.x = 0;
				}

				//also need dodge mechanism
				/*if (this.dodgecooldown <= 1) {
					if (ig.input.pressed('dodge') && ig.input.pressed('left')) { // changing the keypressed to get a more reactive system
						this.leftdodgepressed01 = true;
						this.dodgecooldown = 30;
					} if (ig.input.released('right')) {
						this.rightdodgepressed01 = true;
						this.dodgecooldown = 30;
					}
				}

				if (this.leftdodgepressed01 == true) { // testing on left pressed only
					this.CURRENT_STATE = this.STATE_DODGE;
					this.dodge();
					this.dodgetimer = 0;
				}

				if (ig.input.pressed('right') && this.rightdodgepressed01 == true) {
					this.CURRENT_STATE = this.STATE_DODGE;
					this.dodge();
					this.dodgetimer = 0;
				}*/
				
				//original dodge mechanic didn't work second attempt
				if(ig.input.pressed('dodge') && ig.input.pressed('left')){
					console.log('We got here');
					this.dodge();
				}

				// jump
				if (this.standing && ig.input.pressed('jump')) {
					this.vel.y = -this.jump;
				}

				//doublejump behavior
				if (!this.standing && ig.input.pressed('jump') && this.candoublejump == false) {
					//protection against multiple doublejump
					this.candoublejump = true;
					this.vel.y = -this.jump;
				}

				// shoot
				//if( ig.input.pressed('shoot') ) {
				//ig.game.spawnEntity( EntitySlimeGrenade, this.pos.x, this.pos.y, {flip:this.flip} );
				//}

				//TESTING: if x is pressed, spawn our test proj entity
				if (ig.input.pressed('shoot')) {
					CURRENT_STATE = STATE_PUNCH;
					testPunchSettings.flip = this.flip;
					ig.game.spawnEntity(EntityProjectile, this.pos.x,
						this.pos.y, testPunchSettings);
					//this.messagebox = this.messagebox + "received shoot input";

					CURRENT_STATE = STATE_NORMAL;
				}

				if (this.nettimer < 1) {

					this.nettimer = 100;
					socket.emit('recievedata', this.pos.x, this.pos.y, 0, this.gamename);
				}
				this.nettimer = this.nettimer - 1;
				
				//TESTING: This will be the position of the duck mechanic
				// and eventually the other mechanics that go with those
				if(ig.input.pressed('down')){
					if(this.standing){
						CURRENT_STATE = STATE_DUCK;
					}
				}
			}
			
			//function call to update animations
			this.updateAnim();
			
			this.currentAnim.flip.x = !this.flip;
			
            // move!
            this.parent();
        },
		
		//custom recieve damage function includes armor checking
		recieveDamage: function(amount){
			var damage = amount;
			if(this.armor>0){
				var oldArmorValue = this.armor;
				this.armor = this.armor - damage;
				if(this.armor < 0){this.armor = 0;}
				damage = damage - oldArmorValue;
				if(damage<0){damage = 0; return;} else {
					//subtract remaining incoming damage from health
					this.health = this.health - damage;
				}
			} else { this.health = this.health - damage;}
				
			if(thus.health <= 0) {
				this.kill();
			}
		},

		setMaxVel: function (newMaxVelX, newMaxVelY) {
			this.maxVel.x = newMaxVelX;
			this.maxVel.y = newMaxVelY;
		},
		
		setFriction: function (newFrictionX, newFrictionY){
			this.friction.x = newFrictionX;
			this.friction.y = newFrictionY;
		},
		
		setAcceleration: function(newAccelGround, newAccelAir){
			this.accelGround = newAccelGround;
			this.accelAir = newAccelAir;
		},
		
		setArmor: function(newArmor){
			this.armor = newArmor;
		},
		
		setJump: function(newJump){
			this.jump = newJump;
		},
		
		setAttackDamage: function(newAttackDamage){
			this.attackDamage = newAttackDamage;
		},
		
		setHealth: function(newHealth){
			this.health = newHealth;
		},
		
		setDamageResist: function(newDamageResist){
			this.damageResist = newDamageResist;
		},
		
		onDeath: function() {
			this.currentAnim = this.anims.death;
			ig.game.spawnEntity( EntityWoodSprite, ig.game.startPosition.x, ig.game.startPosition.y);
		},
		
		kill: function() {
			this.parent();
			this.onDeath();
		}
		
	});
});
