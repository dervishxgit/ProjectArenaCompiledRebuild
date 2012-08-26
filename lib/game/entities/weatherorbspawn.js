//(c)opyright 2012 - Steve Miller

//this should be a placeholder object merely marking the spawn point of our weather orb
//it will be manipulated by the weather system,
//it will be commanded to spawn the weather and then destroyed


ig.module('game.entities.weatherorbspawn')
.requires('impact.entity')
.defines(function(){
	EntityWeatherorbspawn = ig.Entity.extend({

		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.BOTH,

		name: 'weatherorbspawn',

		

		

		

		init: function(x, y, settings) {
			this.parent(x, y, settings);

			//this.selectSpawnType(settings.weathertype);

			//this.spawnWeatherOrb();
		},

		check: function(other) {
			this.parent(other);
		},

		

	}); //eol weatherorbspawn

});//eol defines