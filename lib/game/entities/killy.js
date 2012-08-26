ig.module(
	'game.entities.killy'
	)

.requires(
	'impact.entity'
	)

.defines(function() {

	EntityKilly = ig.Entity.extend({

		size: {x: 14000, y: 100},

		collides: ig.Entity.COLLIDES.FIXED,

		init: function(x, y, settings) {
			this.parent(x, y, settings);
		},

		collideWith: function (other, axis) {
			console.log('hit kill y');
			other.kill();
		}


	});//eol entitykilly


}); //eol defines