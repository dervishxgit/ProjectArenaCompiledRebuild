//(c)opyright  2012 - Steve Miller

ig.module(
	'game.entities.trapspike'
)

.requires(
	'impact.entity'
	)

.defines(function() {
	EntityTrapspike = ig.Entity.extend({
		animSheet: new ig.AnimationSheet('media/testPlayerLarger.png', 50, 25),


		size: {
			x: 50, y: 25
		},

		name: "spiketrap",

		//game
		damage: 10,

		bounceBackAmount: 400,
		bounceUpAmount: -400, //negative y bounce

		//entity type, checkagainst and collision
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.BOTH,
		collides: ig.Entity.COLLIDES.FIXED,

		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [1]);
			this.currentAnim = this.anims.idle;
		},

		draw: function() {
			this.parent();
		},

		update: function() {
			this.parent();
		},

		check: function(other) {
			/*console.log(other, 'checked');
			other.receiveDamage(this.damage);*/
		},

		collideWith: function(other, axis) {
			//other.receiveDamage(this.damage);
			//console.log(other, axis);
			if(axis == "x") {
				//console.log('x true');
				if (other.flip) {
					other.vel.x = this.bounceBackAmount;
					this.spikeDamageOther(other);
				} else if (!other.flip) {
					other.vel.x = -this.bounceBackAmount;
				this.spikeDamageOther(other);

				}
				
			} else if (axis == "y") {
				//console.log('y true');
				other.vel.y = this.bounceUpAmount;
				this.spikeDamageOther(other);

			}
		},

		spikeDamageOther: function (other) {
			other.receiveDamage(this.damage);
		}

	}); //line end for entityspiketrap

}); //line end for defines