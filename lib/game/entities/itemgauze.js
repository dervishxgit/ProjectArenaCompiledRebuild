//(c)opyright  2012 - Steve Miller  

//module defines the gauze healing item
//like our other items, it requires the pickup flag to be set from the method pickMeUp()
//before it can execute its effect. the effect should take place on any entity with the .health property


ig.module(
	'game.entities.itemgauze'
)

.requires(
	'impact.entity'
)

.defines(function() {
	EntityItemgauze = ig.Entity.extend({
		size: {x: 25, y:25 },

		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.BOTH,
		collides: ig.Entity.COLLIDES.NEVER,

		flip: false,

		animSheet: new ig.AnimationSheet('media/forest1.png', 25, 25),

		//class specific
		pickUp: true, //the boolean to be flagged if we get a pickup request
		healingValue: 50,
		dispenser: 1, //number of times this item will be activated before being depleted
		gaveHealth: false,

		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.setupAnimation();

		},

		setupAnimation: function() {
			this.addAnim('idle', 1.0, [0]);
		},

		check: function(other) {
			//operates this value of health to give the other a boost
			if (this.pickUp == true) {
				this.giveHealth (other);
			}
			
		},

		//class function
		giveHealth: function(other) {
			//this function will take healing value and add it to the other's health
			//property directly
			if (!this.checkDispenserDepleted()){
				other.health = other.health + this.healingValue;
				this.gaveHealth = true;
			}
			this.useDispenser();
			if(this.checkDispenserDepleted()) {
				this.kill();
			}
			
		},

		pickMeUp: function() {
			//to be called by other classes to notify this that it is trying to be picked up
			if (!this.pickUp) {
				this.pickUp = true;
			}
		},

		checkDispenserDepleted: function() {//checks the dispenser to see if it is out
			if (this.dispenser <= 0) {return true} else {return false}
		},

		useDispenser: function() { //reduces our dispenser count when used
			this.dispenser = this.dispenser - 1;
		}

	}); //end of line entitygauze


});//end of line defines