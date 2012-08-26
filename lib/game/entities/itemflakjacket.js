//(c)opyright  2012 - Steve Miller  

//module defines flak jacket item
//like our other items, must be armed with pickMeUp() function before it takes effect on others

ig.module(
	'game.entities.itemflakjacket'
)

.requires(
	'impact.entity'
)

.defines(function() {
	EntityItemflakjacket = ig.Entity.extend({
		size: {x: 25, y:25 },

		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.BOTH,
		collides: ig.Entity.COLLIDES.NEVER,

		flip: false,

		animSheet: new ig.AnimationSheet('media/forest1.png', 25, 25),

		//class specific
		pickUp: true, //the boolean to be flagged if we get a pickup request
		armorValue: 50,
		dispenser: 1, //number of times this item will be activated before being depleted
		gaveArmor: false,

		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.setupAnimation();
		},

		setupAnimation: function() {
			this.addAnim('idle', 1.0, [0]);
		},

		check: function(other) {
			//operates on other.armor
			if (this.pickUp == true) {
				this.giveArmor (other);
			}
		},

		//class function
		giveArmor: function(other) {
			//this function will take healing value and add it to the other's health
			//property directly
			if (!this.checkDispenserDepleted()){
				other.armor = other.armor + this.armorValue;
				this.gaveArmor = true;
			}
			//console.log(other.armor);
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
	}); //end of line itemflakjacket
});// end of line defines