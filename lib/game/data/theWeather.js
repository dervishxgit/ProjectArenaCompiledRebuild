//(c)opyright 2012 - Steve Miller

ig.module(
	'game.data.theWeather'
	)

.requires(
	'impact.entity',
	'game.entities.weatherentities'
	)

.defines(function(){
	

	ClassTheWeather = ig.Class.extend({
		weatherTimer : null,
		weatherDebugTimer : null,
		weatherOrbRef : null,

		weatherOrbSpawnRef: null,

		currentTypeToBeSpawned: null,
		currentWeather: null,

		defaultWeatherType: 'selector',
		defaultSpawnType: 'EntityWeatherorbselector',
		//defaultUnselected: 'firestorm',

		aSpawnType: {
			firestorm: 'EntityWeatherorbfirestorm', //0
			gravity:   'EntityWeatherorbgravity', 	//1
			wind:      'EntityWeatherorbwind',		//2
			snow:      'EntityWeatherorbsnow',		//3
			selector:  'EntityWeatherorbselector'	//4
		},

		aWeatherType: {
			firestorm: 'firestorm',
			gravity: 'gravity',
			wind: 'wind',
			snow: 'snow',
			selector: 'selector'
		},

		weatherDuration: 10,

		spawnedOrb: false,

		bOrbTouched: false,

		bWeatherOn: false,

		bDidSpawnFirestorm: false,
		bDidSpawnGravity: false,
		bDidSpawnWind: false,
		bDidSpawnSnow: false,

		spawnedMenu: false,

		init: function(weatherType) {
			if (weatherType == undefined || weatherType == null) {
				this.selectWeatherType(this.defaultWeatherType);
				this.selectSpawnType(this.defaultSpawnType);
			} else if (weatherType) {
				this.selectWeatherType(weatherType);
				this.selectSpawnType(weatherType);
			}
			this.weatherTimer = new ig.Timer();
			this.weatherDebugTimer = new ig.Timer();
			//this.selectSpawnType(this.defaultSpawnType);
			console.log('init weather');

		},

		update: function() {
			this.checkWeatherOrbSpawn();
			this.orbTouched();
			

			if (this.spawnedOrb == false) {
				this.spawnWeatherOrb();
				//this.orbTouched();
			}
			if (this.bWeatherOn) {
				this.runWeather();
			}
			

			//testing output and states
			if (this.weatherDebugTimer.delta() > 2) {
				//console.log('weather orb: ' + this.weatherOrbRef);
				//console.log('weather orb spawn:' + this.weatherOrbSpawnRef);
				//console.log(this);
				//console.log(this.weatherOrbSpawnRef.spawnedOrb);
				//console.log(this.weatherOrbSpawnRef.currentTypeToBeSpawned);
				//console.log(this.currentWeather);
				//console.log(this.currentTypeToBeSpawned);
				//console.log(this.bOrbTouched);
				//console.log(this.bWeatherOn);
				//console.log(this.bDidSpawnFirestorm);
				this.weatherDebugTimer.reset();
			}

			
			//this.parent();
		},

		drawWeatherState: function() {
			ig.game.font.draw('weatherState: ' + this.currentWeather + '||' + ' running: ' + this.bWeatherOn, 400 , 2);
			/*if (bDrawCountDown == true) {
				ig.game.font.draw
			}*/
		},

		deregisterCurrentOrb: function() {
			this.weatherOrbRef = null;
		},

		getCurrentOrb: function() {
			return this.weatherOrbRef;
		},

		registerWeatherOrb: function(orbInstance) {
			//public registry for the orb
			if (!this.weatherOrbRef){
				this.weatherOrbRef = orbInstance;
			}
		},

		checkWeatherOrbSpawn: function() {
			//make sure we have a ref to the spawn, get the spawn if we don't
			if (this.weatherOrbSpawnRef) {
				return;
			} else if (!this.weatherOrbSpawnRef) {
				this.weatherOrbSpawnRef = ig.game.getEntityByName('weatherorbspawn');
			}
		},

		setWeatherType: function(type) {
			this.currentWeather = type;
		},

		selectWeatherType: function(type) {
			if (type == this.aWeatherType.firestorm || type == 0 || type == 'firestorm') {
				this.setWeatherType(this.aWeatherType.firestorm);
			} 
			else if (type == this.aWeatherType.gravity || type == 1 || type == 'gravity') {
				this.setWeatherType(this.aWeatherType.gravity);
			} 
			else if (type == this.aWeatherType.wind || type == 2 || type == 'wind') {
				this.setWeatherType(this.aWeatherType.wind);
			} 
			else if (type == this.aWeatherType.snow || type == 3 || type == 'snow') {
				this.setWeatherType(this.aWeatherType.snow);
			}
			else if (type == this.aWeatherType.selector || type == 4 || type == 'selector') {
				this.setWeatherType(this.aWeatherType.selector);
			}
		},

		selectSpawnType: function(type) {
			if (type == this.aSpawnType.firestorm || type == 0 || type == 'firestorm') {
				//this.currentTypeToBeSpawned = this.aSpawnType.firestorm;
				this.setSpawnType(this.aSpawnType.firestorm);
				//currentTypeToBeSpawned = 'EntityWeatherorbfirestorm';
			} 
			else if (type == this.aSpawnType.gravity || type == 1 || type == 'gravity') {
				this.setSpawnType(this.aSpawnType.gravity);
			} 
			else if (type == this.aSpawnType.wind || type == 2 || type == 'wind') {
				this.setSpawnType(this.aSpawnType.wind);
			} 
			else if (type == this.aSpawnType.snow || type == 3 || type == 'snow') {
				this.setSpawnType(this.aSpawnType.snow);
			}
			else if (type == this.aSpawnType.selector || type == 4 || type == 'selector') {
				this.setSpawnType(this.aSpawnType.selector);
			}

		},

		setSpawnType: function(spawnType) {
			this.currentTypeToBeSpawned = spawnType;
		},

		spawnWeatherOrb: function() {
			//for now will spawn firestorm
			ig.game.spawnEntity(
				this.currentTypeToBeSpawned,
				this.weatherOrbSpawnRef.pos.x,
				this.weatherOrbSpawnRef.pos.y
				/*, settings*/
				);
			this.spawnedOrb = true;
		},

		orbTouched: function() {
			//this.weatherOrbSpawnRef.selectSpawnType(0);
			//this.weatherOrbSpawnRef.spawnWeatherOrb();
			if(this.bOrbTouched == true) {
				this.startWeather();
			}
			
		},

		setOrbTouched: function(bool, globalFlag) {
			this.bOrbTouched = bool;
			if (globalFlag) {
				ig.game.sendOutMessage('serverBroadCastWeatherOrbTouched', bool);
				this.setNetWeather(this.currentWeather);
			}
		},

		setNetWeather: function(weatherType) {
			ig.game.sendOutMessage('serverBroadCastWeatherType', weatherType);
		},

		startWeather: function() {
			this.bWeatherOn = true;
		},

		runWeather: function() {
			if (this.currentWeather == this.aWeatherType.firestorm) {
				if (this.bDidSpawnFirestorm == true) {return;}
				else {
					var settings = {lifeTime: null};
					settings.lifeTime = this.weatherDuration;
					ig.game.spawnEntity(EntityFirestorm, 0, 0);
					this.bDidSpawnFirestorm = true;
				}
			}
			else if (this.currentWeather == this.aWeatherType.gravity) {
				if (this.bDidSpawnGravity == true) {return;}
				else {
					var settings = {lifeTime: null};
					settings.lifeTime = this.weatherDuration;
					ig.game.spawnEntity(EntityGravity, 0, 0);
					//ig.game.spawnEntity(EntityGravityeffect, 0 ,0);
					this.bDidSpawnGravity = true;
				}
			}
			else if (this.currentWeather == this.aWeatherType.wind) {
				if (this.bDidSpawnWind == true) {return;}
				else {
					var settings = {lifeTime: null};
					settings.lifeTime = this.weatherDuration;
					ig.game.spawnEntity(EntityWind, 0, 0);
					//ig.game.spawnEntity(EntityWindeffect, 0, 0);
					this.bDidSpawnWind = true;
				}
			}
			else if (this.currentWeather == this.aWeatherType.snow) {
				if (this.bDidSpawnSnow == true) {return;}
				else {
					var settings = {lifeTime: null};
					settings.lifeTime = this.weatherDuration;
					ig.game.spawnEntity(EntitySnow, 0, 0);
					//ig.game.spawnEntity(EntitySnoweffect, 0, 0);
					this.bDidSpawnSnow = true;
				}
			}
		},

		selectWeather: function() {
			//this will be our public access called by player when they touch the orb
			//steps:
			//(1) instantite menu
			if (this.spawnedMenu == true) {
				// do nothing
			}
			else if (this.spawnedMenu == false) {
				ig.game.spawnEntity(EntityWeatherselectmenu, 0, 0);
				this.spawnedMenu = true;				
			}
			//(2) pass menu selection into weather system
			//(3) start weather as normal
		}

	});//eol theweather

	EntityWeatherselectmenu = ig.Entity.extend({
		_wmIgnore: true,

		liveTimer: null,
		lifeTime: 10, //time until the menu will pass a default value and destroy itself
		defaultWeatherValue: 'firestorm',
		returnWeatherValue: null,

		bDrawMenu: true,
		bDrawSelectedMessage: false,

		init: function() {
			//bind our selection keys
			ig.input.bind(ig.KEY._1, 'selection01');
			ig.input.bind(ig.KEY._2, 'selection02');
			ig.input.bind(ig.KEY._3, 'selection03');
			ig.input.bind(ig.KEY._4, 'selection04');

			this.liveTimer = new ig.Timer(this.lifeTime);

		},

		update: function() {
			this.promptSelectionMenu();

			this.parent();

			this.checkLiveTimer();
		},

		draw: function() {
			//draw our select weather prompt

			//temp draw for weather system, will use static screen in future
			if (this.bDrawMenu == true) {
				ig.game.font.draw('input selection: (1) || (2) || (3) || (4)||', 2, 400);
				ig.game.font.draw('(1) Firestorm', 2 , 432 );
				ig.game.font.draw('(2) Gravity', 2 , 464 );
				ig.game.font.draw('(3) Wind', 2 , 496 );
				ig.game.font.draw('(4) Snow', 2, 512 );
				ig.game.font.draw('Countdown: ' + this.liveTimer.delta(), 2, 548);
			}
			else if (this.bDrawSelectedMessage == true) {
				ig.game.font.draw(this.returnWeatherValue + ' selected!' + this.liveTimer.delta(), 2, 400);
			}

			this.parent();
		},

		promptSelectionMenu: function () {
			if (ig.input.pressed('selection01')) {
				this.returnWeatherValue = 'firestorm';
				this.bDrawMenu = false;
				this.bDrawSelectedMessage = true;
			} 
			else if (ig.input.pressed('selection02')) {
				this.returnWeatherValue = 'gravity';
				this.bDrawMenu = false;
				this.bDrawSelectedMessage = true;
			} 
			else if (ig.input.pressed('selection03')) {
				this.returnWeatherValue = 'wind';
				this.bDrawMenu = false;
				this.bDrawSelectedMessage = true;
			} 
			else if (ig.input.pressed('selection04')) {
				this.returnWeatherValue = 'snow';
				this.bDrawMenu = false;
				this.bDrawSelectedMessage = true;
			} 
		},

		reportSelection: function() {
			//simulates a player touch
			ig.game.theWeather.selectWeatherType(this.returnWeatherValue);
			ig.game.theWeather.setOrbTouched(true, true);
		},

		checkLiveTimer: function() {
			//we are counting towards 0, so the timer will be in t-minus
			var timerdelta = this.liveTimer.delta();
			if (timerdelta < 0) {
				//nothing
			}
			else if (timerdelta >= 0) {
				//we are out of time, so check to see if there is a value for our return
				//if there is not then we use the default value
				if (this.returnWeatherValue == null) {
					this.returnWeatherValue = this.defaultWeatherValue;
					this.reportSelection();
				}
				else if (this.returnWeatherValue) {
					this.reportSelection();
				}
				//the selection should be reported so we can go ahead and kill this instance
				this.kill();
			}
		}





	}); //eol weatherselectmenu

});//eol defines