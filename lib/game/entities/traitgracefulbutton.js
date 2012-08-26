ig.module(
	'game.entities.traitgracefulbutton'
)
.requires(
  'impact.entity',
  'game.entities.backbutton'
)
.defines(function() {
// A Button Entity for Impact.js
// Has 4 States: 
// * hidden - Not shown
// * idle - just sitting there
// * active - someone is pushing on it
// * deactive - shown, but not usable

// And 3 Events
// * pressedDown - activated when pressed Down
// * pressed - constantly fires when pressing
// * pressedUp - activated when button released

// Can render Text. Should explain itself.

// Use like you want to, just don't blame me for anything.
 
  EntityTraitgracefulbutton = EntityBackbutton.extend({
	size: { x: 96, y: 64 },
	animSheet: new ig.AnimationSheet( 'media/traitGraceful.jpg', 96, 64 ),
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		//any other init varialbles
	},
	update: function() {
	this.parent();
	}
  }); // line end entitytestbutton
});