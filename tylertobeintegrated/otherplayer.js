ig.module(
	'game.entities.otherplayer'
)
.requires(
	'impact.entity'
)
.defines(function () {

	var CURRENT_STATE = 1;
	var STATE_NORMAL = 1;
	var STATE_DODGE = 2;
	var STATE_PUNCH = 3;
	var STATE_DUCK = 4;
	var STATE_PAIN = 5;
    ///////////////////////////////Enemy Other Players////////////////////////////////
    EntityOtherplayer = ig.Entity.extend({
        size: {
            x: 32,
            y: 48
        },

        speed: 100,
        name: "otherplayer",
        gamename: "",
        animation: 1,
        destinationx: 999999,
        destinationy: 999999,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        animSheet: new ig.AnimationSheet('media/Wood_spritesheet.png', 200, 200),

        init: function (x, y, settings) {
          
            this.parent(x, y, settings);

            this.health = 100;

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
			//this.addAnim( 'duckend', .16, [43,44]);
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

            ig.game.playerList.otherplayer = this;
        },

        netmoveplayer: function () {

            this.pos.x = positionx;
            this.pos.y = positiony;

        },
		
		updateAnim: function () {
			
			// set the current animation, based on the player's speed
			if (this.vel.x == 0){
				if (this.vel.y < 0) {
					this.currentAnim = this.anims.jump;
				}
				else if (this.vel.y > 0) {
					this.currentAnim = this.anims.fall;
				}
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
		
        update: function () {

             // set the current animation, based on the player's speed
            this.updateAnim();

            this.currentAnim.flip.x = this.flip;

            
            /*switch (this.animation) {
                case 1:
                    this.currentAnim = this.anims.up;
                    break;
                case 2:
                    this.currentAnim = this.anims.down;
                    break;
                case 3:
                    this.currentAnim = this.anims.left;
                    break;
                case 4:
                    this.currentAnim = this.anims.right;
                    break;
                case 5:
                    this.currentAnim = this.anims.idleup;
                    break;
                case 6:
                    this.currentAnim = this.anims.idledown;
                    break;
                case 7:
                    this.currentAnim = this.anims.idleleft;
                    break;
                case 8:
                    this.currentAnim = this.anims.idleright;
                    break;

            }*/
        }

    });

})