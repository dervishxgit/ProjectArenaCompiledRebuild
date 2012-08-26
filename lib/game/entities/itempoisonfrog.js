//(c)opyright  2012 - Steve Miller  

//module defines poison frog item
//like our other items, must be armed with pickMeUp() function before it takes effect on others

ig.module(
	'game.entities.itempoisonfrog'
)

.requires(
	'impact.entity'
)

.defines(function() {
	EntityItempoisonfrog = ig.Entity.extend({
		size: {x: 25, y:25 },

		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.BOTH,
		collides: ig.Entity.COLLIDES.NEVER,

		flip: false,

		animSheet: new ig.AnimationSheet('media/forest1.png', 25, 25),

		//class specific
		pickUp: true, //the boolean to be flagged if we get a pickup request
		dispenser: 1, //number of times this item will be activated before being depleted

		//poisoning
		poisoningFlag: false,
		gavePoison: false,
		poisonTimeDuration: 60, //duration of effect in seconds
		poisonTimer: null,
		poisonSecondTimerInterval: 1,
		poisonSecondTimer: null,
		poisonDamage: 1,
		poisonAmountRemaining: null,


		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.setupAnimation();
		},

		setupAnimation: function() {
			this.addAnim('idle', 1.0, [0]);
		},

		update: function() {
			this.parent();
			if (this.poisoningFlag) {
				this.applyPoisonOverTime(this.poisonTargetRef);
			} else {return;}

			if (this.poisoningFlag && (this.poisonTimer.delta() >= 0)) {
				this.kill();
			}
		},

		check: function(other) {
			//operates on other.armor
			if (this.gavePoison) {
				return;
			}
			if (this.pickUp == true) {
				this.givePoison(other);
				this.gavePoison = true;
				console.log('gave poison to: ' + other);
			}
		},

		//class function
		givePoison: function(other) {
			//this function will take healing value and add it to the other's health
			//property directly
			if (!this.checkDispenserDepleted()){
				other.poisonCarrier = true;
				other.poisonFrogRef = this;
				this.poisonTimer = new ig.Timer();
				this.poisonSecondTimer = new ig.Timer();
				this.poisonTimer.set(this.poisonTimeDuration);
				this.poisonSecondTimer.set(this.poisonSecondTimerInterval);
			}
			
			this.useDispenser();
			/*if(this.checkDispenserDepleted()) {
				this.kill();
			}*/
			
		},

		runPoisonOnOther: function(sender, target) {
			if (this.checkPoisonTimer()) {
				this.poisoningFlag = true;
				this.poisonTargetRef = target;
				//console.log('poison begins');
				//applyPoisonOverTime(other);
			}
		},

		applyPoisonOverTime: function(other) {
			//check against our timer for a second's passing and apply damage
			if (this.poisonSecondTimer.delta() >= 1) {
				other.receiveDamage(this.poisonDamage);
				this.poisonSecondTimer.set(this.poisonSecondTimerInterval);
				//console.log('poisoned, secs remain: ' + this.poisonTimer.delta());
			}
		},

		checkPoisonTimer: function() {
			if (this.poisonTimer.delta() <= 0) {
				return true;
			} else {
				return false;
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
	}); //end of line itempoisonfrog
});// end of line defines