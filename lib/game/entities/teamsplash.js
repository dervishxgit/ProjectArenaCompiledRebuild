ig.module (
	'game.entities.teamsplash'
)
ig.requires (
	'impact.entity'
)
.defines (function() {
	EntityTeamsplash = ig.Entity.extend ({
		size: [960, 640],
		timerin: 0,
		timerout: 0,
		animSheet: new ig.AnimationSheet ( 'media/teamSplash.jpg', 960, 640 ),
		init: function ( x, y, settings ) {
			this.parent ( x, y, settings );
			this.addAnim( 'fade', 6.0, [0] );
		},
		update: function () {
			if (this.timerin < 180) {
				this.timerin++;
			};
			if (this.timerin == 180) {
				this.timerout++;
			};
			if (this.timerout > 180) {
				this.timerout = 180;
			};
			this.anims.fade.alpha = (this.timerin - this.timerout) / 120;
			if (this.timerout == 180) {
				ig.system.setGame(MainMenu);
				this.kill();
			};
			this.parent ();
		}
	});
});