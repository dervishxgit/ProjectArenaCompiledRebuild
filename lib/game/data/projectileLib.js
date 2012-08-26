//(c)opyright  2012 - Steve Miller

/*
module defines projectile library and projectile settings structs that will be loaded
into memory. the projectilelib will be a holder for the structs, and will allocate on init


*/

ig.module(
	'game.data.projectileLib'
	)
.requires(

	)
.defines(function (){
	ClassProjectilelib = ig.Class.extend({

		//define settings for library
		test: true,

		//declare each struct to be held
		testPunchStruct: {},

		init: function() {

			//initialize new instances of the projectilestructs
			this.testPunchStruct = new ClassProjectileStruct;
			/*console.log("initialized Projectile Library");
			console.log(this.testPunchStruct);*/

		}
	});

	ClassProjectileStruct = ig.Class.extend({
		test: true,

		//empty array to be inherited by children and configured by their init
		//this settings array will be what we pass to the initializer of projectiles
		settingsArray: {
			
		},

		init: function() {
			/*this.test = true;
			console.log("initialized a proj struct");*/
		}
	});

	ClassBasicPunch = ClassProjectileStruct.extend({

	});
});