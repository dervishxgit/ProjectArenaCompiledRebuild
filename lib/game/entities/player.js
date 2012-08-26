//(c)opyright  2012 - Steve Miller

ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity',
    'game.entities.projectile'
)
.defines(function () {

    var testPunchSettings = {
        flip: false,
        bWatchSpawnerPosition: true, 
        referenceSpawner: null,
        lifeTime: 100,
        offsetSpawnOrigin: {x: 100, y: 0},
        punchString: "",
    };

    /*var argsArray  = {
        positionx: null,
        positiony: null,
        iNetAnim: null,
        flip: null,
        gamename: null,
        health: null,
        armor: null
    };*/

    var CURRENT_STATE = 1;  
    var STATE_NORMAL = 1;
    var STATE_DODGE = 2;
    var STATE_PUNCH = 3;
    var STATE_DUCK = 4;
    var STATE_PAIN = 5;

    EntityPlayer = ig.Entity.extend({

        // The players (collision) size is a bit smaller than the animation
        // frames, so we have to move the collision box a bit (offset)
        size: { x: 100, y: 100 },
        //offset: {x: 4, y: 2},

        maxVel: { x: 400, y: 1000 },
        //maxVel: {x: 100, y: 200},
        friction: { x: 4000, y: 0 },

        offset: {
            x: 50,
            y: 100
        },

        originalStats: {
            maxVel: {x: null, y: null},
            friction: {x: null, y: null},
            size: {x: 100, y: 100 },
            jump: null,
            accelGround: null,
            accelAir: null
        },

        startPosition: {x: 0, y: 0},

        type: ig.Entity.TYPE.A, // Player friendly group
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,

        //animSheet: new ig.AnimationSheet( 'media/playerLarge.png', 32, 48 ),	
        //animSheet: new ig.AnimationSheet('media/testPlayerLarger.png', 100, 100),
        animSheet: new ig.AnimationSheet('media/Wood_spritesheet.png', 200, 200),


        // These are our own properties. They are not defined in the base
        // ig.Entity class. We just use them internally for the Player
        //flip: true,

        lives: 3,

        accelGround: 1600,
        accelAir: 4000,
        jump: 500,
        candoublejump: false,
        canDodge : true,
        /*leftdodgepressed01: false,
        leftdodgepressed02: false,
        rightdodgepressed01: false,
        rightdodgepressed02: false,*/
        duckedstate : false,
        dodgeTimerLeft: null,
        dodgeTimerRight: null,              // dodge timer, used to initiate the dodge mechanic
        dodgeResetTimer: null,
        dodgeWindow: 0.25,
        dodgeCoolDown: 1.5,         
        dodgeCoolDownTimer: null, // cooldown timer, time before it dodge is available. Right now it's reall short.
 
        bUnderTheWeather: false,

        dodgedistance: 50,
        health: 100,
        armor: 0,
        flip: false,

        damageResist: 0,

        poisonCarrier: false,
        poisonFrogRef: null,

        name: "player",
        gamename: playername,

        messagebox: "",
        messageboxtimer: 0,

        //bounciness: 1,

        //net
        nettimer: 10,
        iNetAnim: 0,

        //punch
        punchBasicString: "punchBasic",
        offsetSpawnOrigin: {x: 100, y: 0}, //the coords of where we spawn projectiles, additive as offset

        argsArray  : {
            positionx: null,
            positiony: null,
            iNetAnim: null,
            flip: null,
            gamename: null,
            health: null,
            armor: null,
            lives: null
        },

        initializedOnce: false,
        playerDebugTimer: null,

        //character Traits
        //these traits will be boolean that reflect the values passed at character selection
        weight: null, //true = Lugnut, false = Feathery
        tactility: null, //true = Brutish, false = Graceful
        physique: null, //true = Cornfed, false = Wiry

        init: function(x, y, settings, spriteChoice, weight, tactility, physique){
            this.parent(x, y, settings);
            
            if(weight){
                this.setAcceleration(this.accelGround, 2000);
                this.setJump(250);
                this.weight = true;
            }
            else{
                this.setAcceleration(this.accelGround, 4000);
                this.setJump(500);
                this.weight = false;
            }
            
            if(tactility){
                this.setAttackDamage(3);
                this.tactility = true;
            }
            else{
                this.setAttackDamage(1);
                this.tactility = false;
            }
            
            if(physique){
                this.setHealth(150);
                this.setDamageResist(0);
                this.physique = true;
            }
            else{
                this.setHealth(100);
                this.setDamageResist(5);
                this.physique = false;
            }

            this.startPosition.x = x;
            this.startPosition.y = y;

            /*//old testing anims
            this.addAnim('idle', 1, [1]);
            this.addAnim('run', 0.07, [1]);
            this.addAnim('jump', 0.5, [0]);
            this.addAnim('fall', 0.4, [0]);*/

            this.setupAnimation();

            //add ourself to the game's player list
            //ig.game.playerList.thisPlayer = this;

            //set self as the spawner in testPunchSettings
            testPunchSettings.referenceSpawner = this;

            this.dodgeTimerLeft = new ig.Timer();
            this.dodgeTimerRight = new ig.Timer();
            this.dodgeResetTimer = new ig.Timer();
            this.dodgeCoolDownTimer = new ig.Timer();
            this.playerDebugTimer = new ig.Timer();
            //this.dodgeTimerLeft.set();
            //this.dodgeTimerRight.set();
            //this.dodgeTimer.set();

            //if this is our first init:
            if(!this.initializedOnce) {
                //broadcast player init to all other players so that they run a clone
                socket.emit('initializeplayer', this.gamename);
                this.initializedOnce = true;
                console.log('should see player init once');
            }

            this.backupOriginalStats();

        },

        backupOriginalStats: function() {
            /*originalStats: {
                maxVel: {x: null, y: null},
                friction: {x: null, y: null},
                size: {x: 100, y: 100 },
                jump: null;
                accelGround: null,
                accelAir: null
            },*/
            this.originalStats.maxVel.x = this.maxVel.x;
            this.originalStats.maxVel.y = this.maxVel.y;
            this.originalStats.friction.x = this.friction.x;
            this.originalStats.friction.y = this.friction.y;
            this.originalStats.jump = this.jump;
            this.originalStats.accelGround = this.accelGround;
            this.originalStats.accelAir = this.accelAir;
        },

        restoreOriginalStats: function() {
            this.maxVel.x = this.originalStats.maxVel.x;
            this.maxVel.y = this.originalStats.maxVel.y;
            this.friction.x = this.originalStats.friction.x;
            this.friction.y = this.originalStats.friction.y;
            this.jump = this.originalStats.jump;
            this.accelGround = this.originalStats.accelGround;
            this.accelAir = this.originalStats.accelAir;
        },

        setupAnimation: function() {
            // sets all the animation states for the player, currently using a test sprite
            
            //old version
            /*this.addAnim( 'run', 0.16, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] );
            this.addAnim( 'idle', 0.16, [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23] );
            this.addAnim( 'swingattack', .66, [24, 25, 26, 27] );
            this.addAnim( 'punchattack', .66, [28, 29, 30, 31] );
            this.addAnim( 'swingattackreverse', .66, [98, 99, 100, 101] );
            this.addAnim( 'punchattackreverse', .66, [102, 103, 104, 105] );
            this.addAnim( 'pain', .66, [32, 33, 34, 35] );
            this.addAnim( 'block', .5, [36, 37, 38] );
            this.addAnim( 'dodge', .5, [39, 40, 41] );
            this.addAnim( 'duck', .5, [42, 43, 44] );
            this.addAnim( 'duckattack', .66, [45, 46, 47, 48] );
            this.addAnim( 'jump', .5, [49, 50, 51] );
            this.addAnim( 'idleairidle', .5, [52, 53, 54] );
            this.addAnim( 'idledoublejump', .5, [55, 56, 57] );
            this.addAnim( 'forwardjump', .5, [58, 59, 60] );
            this.addAnim( 'forwardairidle', .5, [61, 62, 63] );
            this.addAnim( 'forwarddoublejump', .5, [64, 65, 66] );
            this.addAnim( 'backwardjump', .5, [67, 68, 69] );
            this.addAnim( 'backwardairidle', .5, [70, 71, 72] );
            this.addAnim( 'backwarddoublejump', .5, [73, 74, 75] );
            this.addAnim( 'fall', .5, [76, 77, 78] );
            this.addAnim( 'airdodge', .5, [79, 80, 81] );
            this.addAnim( 'victory', 1.33, [82, 83, 84, 85, 86, 87, 88, 89] );
            this.addAnim( 'death', 1.33, [90, 91, 92, 93, 94, 95, 96, 97] );*/

            this.addAnim( 'run', 0.16, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] );
            this.addAnim( 'idle', 0.16, [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23] );
            this.addAnim( 'swingattack', .66, [24, 25, 26, 27] ); //not implemented
            this.addAnim( 'punchattack', .16, [28, 29, 30, 31] ); //not implemented
            this.addAnim( 'swingattackreverse', .66, [98, 99, 100, 101] ); //not implemented
            this.addAnim( 'punchattackreverse', .66, [102, 103, 104, 105] ); //not implemented
            this.addAnim( 'pain', .66, [32, 33, 34, 35] ); //not implemented
            this.addAnim( 'block', .5, [36, 37, 38] ); //not implemented
            this.addAnim( 'dodge', .5, [39, 40, 41] ); //not implemented
            this.addAnim( 'duckstart', .16, [42, 43, 44] ); //implemented, but needs work
            this.addAnim( 'ducked', .16, [44]);
            this.addAnim( 'duckend', .16, [43,44]);
            this.addAnim( 'duckattack', .66, [45, 46, 47, 48] ); //implemented, needs more work
            this.addAnim( 'jump', .5, [49, 50, 51] ); 
            this.addAnim( 'idleairidle', .5, [52, 53, 54] );
            this.addAnim( 'idledoublejump', .5, [55, 56, 57] );
            this.addAnim( 'forwardjump', .5, [58, 59, 60] );
            this.addAnim( 'forwardairidle', .5, [61, 62, 63] );
            this.addAnim( 'forwarddoublejump', .5, [64, 65, 66] );
            this.addAnim( 'backwardjump', .5, [67, 68, 69] ); //not implemented
            this.addAnim( 'backwardairidle', .5, [70, 71, 72] ); //not implemented
            this.addAnim( 'backwarddoublejump', .5, [73, 74, 75] ); //not implemented
            this.addAnim( 'fall', .5, [76, 77, 78] );
            this.addAnim( 'airdodge', .5, [79, 80, 81] ); //not implemented
            this.addAnim( 'victory', 1.33, [82, 83, 84, 85, 86, 87, 88, 89] ); //not implemented
            this.addAnim( 'death', 1.33, [90, 91, 92, 93, 94, 95, 96, 97] ); //not implemented
        },

        messageBoxWrite: function(string) {
            this.messagebox = this.messagebox + string;
        },

        //custom receive damage function includes armor checking
        receiveDamage: function(amount) {
            var damage = amount;
            //check for resist
            if (this.damageResist) {
                damage = damage - this.damageResist;
            }

            if (this.armor > 0) {
                var oldArmorValue = this.armor;
                this.armor = this.armor - damage;
                if (this.armor < 0) {this.armor = 0;}
                damage = damage - oldArmorValue;
                if (damage < 0) {damage = 0; return;} else {
                    //subtract remaining incoming damage from health
                    this.health = this.health - damage;
                }
                
            } else { this.health = this.health - damage;}

            if( this.health <= 0 ) {
                this.kill();
            }
        },

        check: function(other) {
            if (this.poisonCarrier && this.poisonFrogRef && !this.poisonFrogRef.poisoningFlag/*&& other.name == 'otherplayer'*/) {
                this.poisonFrogRef.runPoisonOnOther(this, other);
                //console.log('poisoned: ' + other);
            }
            this.parent(other);
            //also

        },

        updateAnim: function () {
            
            // set the current animation, based on the player's speed
            if (this.vel.y < 0) {
                this.currentAnim = this.anims.jump;
            }
            else if (this.vel.y > 0) {
                this.currentAnim = this.anims.fall;
            }
            
            //all the current conditions that are related to jumping  
            if (this.vel.x != 0 && this.vel.y < 0) {
                this.currentAnim = this.anims.forwardjump;
            }
            
            if (this.vel.x != 0 && this.vel.y == 0){
                this.currentAnim = this.anims.run;
            }
            
            if (this.vel.y == 0 && this.vel.x == 0) {
                    this.currentAnim = this.anims.idle;
                }
            
            if(this.candoublejump == true){
                if (this.vel.y < 0 && this.vel.x == 0) {
                    this.currentAnim = this.anims.idledoublejump;
                }
                if (this.vel.y < 0 && this.vel.x != 0){
                    this.currentAnim = this.anims.forwarddoublejump;
                }
            }
            
            if (CURRENT_STATE == STATE_DODGE){
                this.currentAnim = this.anims.dodge;
            }
            
            if (CURRENT_STATE == STATE_PUNCH){
                this.currentAnim = this.anims.punchattack;
            }
            
            if (CURRENT_STATE == STATE_DUCK){
                if(this.duckedstate)
                {
                    this.anims.duckstart;
                    this.duckstate = true;
                }
                else if(ig.input.pressed('shoot')){ // this is supposed to be the ducked punching mechanic currenlty plays one frame and
                    this.anims.duckattack;          // then switches back to normal ducked animation
                }
                else{
                    this.currentAnim = this.anims.ducked;
                }
            }
        },

        reset: function() {
            this.setMaxVel(400, 1000);
            this.setFriction(4000, 0);
            this.setAcceleration(1600, 4000);
        },

        resetMaxVel: function() {
            if (this.bUnderTheWeather) {
                //nothing
            }
            else if (!this.bUnderTheWeather) {
                this.setMaxVel(this.originalStats.maxVel.x, this.originalStats.maxVel.y);
            }
        },

        dodge: function(){
            if (!this.bUnderTheWeather) {

                if (this.canDodge) {

                    this.dodgeResetTimer.set();      
                    this.maxVel.x = 3000;
                    if(this.flip == true){
                        this.vel.x = -1500;
                    }
                    else if (this.flip == false){
                        this.vel.x =  1500;
                    }
                    //this.CURRENT_STATE = this.STATE_NORMAL;
                    //this.reset();
                    //console.log('dodged');
                    //return;
                }
            }
        },

        dodgeReset: function() {
            var resetDelta = this.dodgeResetTimer.delta();
            if (resetDelta > 0.2) {
                this.resetMaxVel();
            }
        },

        dodgeCoolDownReset: function() {
            var resetDelta = this.dodgeCoolDownTimer.delta();
            if (resetDelta > 2) {
                this.canDodge = true;
                this.dodgeCoolDownTimer.set();
                //console.log('dodge available');
            }
        },

        update: function () {

            this.dodgeReset();
            this.dodgeCoolDownReset();

            if(CURRENT_STATE == STATE_DUCK){
                this.size.y = 50;
                this.offset.y = 150;
                if(ig.input.released('down')){
                    this.duckedstate = false;
                    CURRENT_STATE = STATE_NORMAL;
                    this.size.y = 100;
                    this.offset.y = 100;
                    this.pos.y -= 51;
                }
                if(ig.input.pressed('shoot')){
                    testPunchSettings.flip = this.flip;
                    ig.game.spawnEntity(EntityProjectile, this.pos.x,
                        this.pos.y, testPunchSettings);
                    
                }
            }

            /*if (this.dodgecooldown >= 1) {
                this.dodgecooldown -= 1;
            }
            this.dodgetimer -= 1;
            if (this.dodgetimer <= 1) {
                this.leftdodgepressed01 = false;
                this.leftdodgepressed02 = false;
                this.rightdodgepressed01 = false;
                this.rightdodgepressed02 = false;
            }*/

            if (CURRENT_STATE == STATE_NORMAL) {
            //reset certain conditions on ground (.standing state)
                

                if (this.standing == true) {
                    this.candoublejump = false;
                    //this.canDodge = true;
                }
                // move left or right
                //but first set our dodgetimer based on move
                if (ig.input.pressed('left')) {
                    //console.log('pressed left');
                    var dodgedelta = this.dodgeTimerLeft.delta();
                    if (dodgedelta < this.dodgeWindow && this.canDodge == true) {
                        this.dodge();
                        this.dodgeTimerLeft.set();
                        this.canDodge = false;
                    } else if (dodgedelta >= 1) {
                        this.dodgeTimerLeft.set();
                    }
                } else if (ig.input.pressed('right')) {
                    var dodgedelta = this.dodgeTimerRight.delta();
                    if (dodgedelta < this.dodgeWindow && this.canDodge == true) {
                        this.dodge();
                        this.dodgeTimerRight.set();
                        this.canDodge = false;
                    } else if (dodgedelta >= 1) {
                        this.dodgeTimerRight.set();
                    }
                }


                var accel = this.standing ? this.accelGround : this.accelAir;
                if (ig.input.state('left')) {
                    //this.vel.x = -1000;
                    this.accel.x = -accel;
                    this.flip = true;
                    this.dodgetimer = 7;

                }
                else if (ig.input.state('right')) {
                    //this.vel.x = 1000;
                    this.accel.x = accel;
                    this.flip = false;
                    this.dodgetimer = 7;
                }
                else {
                    this.accel.x = 0;
                }
                // jump
                if (this.standing && ig.input.pressed('jump')) {
                    this.vel.y = -this.jump;
                }

                //doublejump behavior
                if (!this.standing && ig.input.pressed('jump') && this.candoublejump == false) {
                    //protection against multiple doublejump
                    this.candoublejump = true;
                    this.vel.y = -this.jump;
                }

                //TESTING: if x is pressed, spawn our test proj entity
                if (ig.input.pressed('shoot')) {
                    testPunchSettings.flip = this.flip;
                    testPunchSettings.punchString = this.punchBasicString;
                    //we need to check for the flip state and feed spawnposition data
                    if (this.flip){
                        ig.game.spawnEntity(
                            EntityBasicpunch, 
                            this.pos.x - this.offsetSpawnOrigin.x,
                            this.pos.y + this.offsetSpawnOrigin.y, 
                            testPunchSettings
                        );
                    } else if (!this.flip){
                        ig.game.spawnEntity(
                            EntityBasicpunch, 
                            this.pos.x + this.offsetSpawnOrigin.x,
                            this.pos.y + this.offsetSpawnOrigin.y, 
                            testPunchSettings
                        );
                    }
                    
                }

                if(ig.input.pressed('down')){
                    if(this.standing){
                        CURRENT_STATE = STATE_DUCK;
                    }
                }
            }
            
            this.updateAnim();
            //testing output and states
            if (this.playerDebugTimer.delta() > 2) {
                //console.log(this.maxVel.x, this.maxVel.y);
                this.playerDebugTimer.reset();
            }

            ////////////////////////////////////////////////////


            // set the current animation, based on the player's speed
            /*if (this.vel.y < 0) {
                this.currentAnim = this.anims.jump;
            }
            else if (this.vel.y > 0) {
                this.currentAnim = this.anims.fall;
            }
            else if (this.vel.x != 0) {
                this.currentAnim = this.anims.run;
            }
            else {
                this.currentAnim = this.anims.idle;
            }*/

            this.currentAnim.flip.x = !this.flip;

            if (this.nettimer < 1) {

                //console.log(this.dodgeTimerLeft.delta());
                this.setNetAnim();

                this.nettimer = 1;
                /*var argsArray  = {
                    positionx: this.pos.x,
                    positiony: this.pos.y,
                    iNetAnim: this.iNetAnim,
                    flip: this.flip,
                    gamename :this.gamename,
                    health: this.health,
                    armor: this.armor
                };*/

                this.argsArray.positionx = this.pos.x;
                this.argsArray.positiony = this.pos.y;
                this.argsArray.iNetAnim = this.iNetAnim;
                //argsArray.iNetAnim = 2;
                this.argsArray.flip = this.flip;
                this.argsArray.gamename = this.gamename;
                this.argsArray.health = this.health;
                this.argsArray.armor = this.armor;
                this.argsArray.lives = this.lives;
                /*socket.emit('recievedata', this.pos.x, 
                    this.pos.y, this.iNetAnim, 
                    this.flip, this.gamename );*/
                /*console.log(this.pos.x, 
                    this.pos.y, this.iNetAnim, 
                    this.flip, this.gamename );*/
                //console.log(argsArray);
                socket.emit('recievedata', this.argsArray);
                //console.log(argsArray.iNetAnim);
            }
            this.nettimer = this.nettimer - 1;

            
            // move!
            this.parent();


            //debug output
          //  console.log(this.health);
        },

        setNetAnim: function() {
            //checklist

    /*  0    this.addAnim( 'run', 0.16, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] );
        1    this.addAnim( 'idle', 0.16, [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23] );
        2    this.addAnim( 'swingattack', .66, [24, 25, 26, 27] ); //not implemented
        3    this.addAnim( 'punchattack', .16, [28, 29, 30, 31] ); //not implemented
        4    this.addAnim( 'swingattackreverse', .66, [98, 99, 100, 101] ); //not implemented
        5    this.addAnim( 'punchattackreverse', .66, [102, 103, 104, 105] ); //not implemented
        6    this.addAnim( 'pain', .66, [32, 33, 34, 35] ); //not implemented
        7    this.addAnim( 'block', .5, [36, 37, 38] ); //not implemented
        8    this.addAnim( 'dodge', .5, [39, 40, 41] ); //not implemented
        9    this.addAnim( 'duckstart', .16, [42, 43, 44] ); //implemented, but needs work
        10    this.addAnim( 'ducked', .16, [44]);
        11    this.addAnim( 'duckend', .16, [43,44]);
        12    this.addAnim( 'duckattack', .66, [45, 46, 47, 48] ); //implemented, needs more work
        13    this.addAnim( 'jump', .5, [49, 50, 51] ); 
        14    this.addAnim( 'idleairidle', .5, [52, 53, 54] );
        15    this.addAnim( 'idledoublejump', .5, [55, 56, 57] );
        16    this.addAnim( 'forwardjump', .5, [58, 59, 60] );
        17    this.addAnim( 'forwardairidle', .5, [61, 62, 63] );
        18    this.addAnim( 'forwarddoublejump', .5, [64, 65, 66] );
        19    this.addAnim( 'backwardjump', .5, [67, 68, 69] ); //not implemented
        20    this.addAnim( 'backwardairidle', .5, [70, 71, 72] ); //not implemented
        21    this.addAnim( 'backwarddoublejump', .5, [73, 74, 75] ); //not implemented
        22    this.addAnim( 'fall', .5, [76, 77, 78] );
        23    this.addAnim( 'airdodge', .5, [79, 80, 81] ); //not implemented
        24    this.addAnim( 'victory', 1.33, [82, 83, 84, 85, 86, 87, 88, 89] ); //not implemented
        25    this.addAnim( 'death', 1.33, [90, 91, 92, 93, 94, 95, 96, 97] ); //not implemented*/

            //list of sendable animations:
            // 1 // idle
            // 2 // run
            // 3 // jump
            // 4 // fall


            //switcher, sets an integer/string based on current anim for net broadcast
            if (this.currentAnim == this.anims.run) {
                this.iNetAnim = 0;
            }
            else if (this.currentAnim == this.anims.idle) {
                this.iNetAnim = 1;
            }
            else if (this.currentAnim == this.anims.swingattack) {
                //console.log("im jumping");
                this.iNetAnim = 2;
            }
            else if (this.currentAnim == this.anims.punchattack) {
                this.iNetAnim = 3;
            }
            else if (this.currentAnim == this.anims.swingattackreverse) {
                this.iNetAnim = 4;
            }
            else if (this.currentAnim == this.anims.punchattackreverse) {
                this.iNetAnim = 5;
            }
            else if (this.currentAnim == this.anims.pain) {
                this.iNetAnim = 6;
            }
            else if (this.currentAnim == this.anims.block) {
                this.iNetAnim = 7;
            }
            else if (this.currentAnim == this.anims.dodge) {
                this.iNetAnim = 8;
            }
            else if (this.currentAnim == this.anims.duckstart) {
                this.iNetAnim = 9;
            }
            else if (this.currentAnim == this.anims.ducked) {
                this.iNetAnim = 10;
            }
            else if (this.currentAnim == this.anims.duckend) {
                this.iNetAnim = 11;
            }
            else if (this.currentAnim == this.anims.duckattack) {
                this.iNetAnim = 12;
            }
            else if (this.currentAnim == this.anims.jump) {
                this.iNetAnim = 13;
            }
            else if (this.currentAnim == this.anims.idleairidle) {
                this.iNetAnim = 14;
            }
            else if (this.currentAnim == this.anims.idledoublejump) {
                this.iNetAnim = 15;
            }
            else if (this.currentAnim == this.anims.forwardjump) {
                this.iNetAnim = 16;
            }
            else if (this.currentAnim == this.anims.forwardairidle) {
                this.iNetAnim = 17;
            }
            else if (this.currentAnim == this.anims.forwarddoublejump) {
                this.iNetAnim = 18;
            }
            else if (this.currentAnim == this.anims.backwardjump) {
                this.iNetAnim = 19;
            }
            else if (this.currentAnim == this.anims.backwardairidle) {
                this.iNetAnim = 20;
            }
            else if (this.currentAnim == this.anims.backwarddoublejump) {
                this.iNetAnim = 21;
            }
            else if (this.currentAnim == this.anims.fall) {
                this.iNetAnim = 22;
            }
            else if (this.currentAnim == this.anims.airdodge) {
                this.iNetAnim = 23;
            }
            else if (this.currentAnim == this.anims.victory) {
                this.iNetAnim = 24;
            }
            else if (this.currentAnim == this.anims.death) {
                this.iNetAnim = 25;
            }

        },

        setMaxVel: function (newMaxVelX, newMaxVelY) {
            this.maxVel.x = newMaxVelX;
            this.maxVel.y = newMaxVelY;
        },
        
        setFriction: function (newFrictionX, newFrictionY){
            this.friction.x = newFrictionX;
            this.friction.y = newFrictionY;
        },
        
        setAcceleration: function(newAccelGround, newAccelAir){
            this.accelGround = newAccelGround;
            this.accelAir = newAccelAir;
        },
        
        setArmor: function(newArmor){
            this.armor = newArmor;
        },
        
        setJump: function(newJump){
            this.jump = newJump;
        },

        setGravityFactor: function(newGravityFactor) {
            this.gravityFactor = newGravityFactor;
        },
        
        setAttackDamage: function(newAttackDamage){
            this.attackDamage = newAttackDamage;
        },
        
        setHealth: function(newHealth){
            this.health = newHealth;
        },
        
        setDamageResist: function(newDamageResist){
            this.damageResist = newDamageResist;
        },

        setUnderTheWeather: function (bool) {
            this.bUnderTheWeather = bool;
        },
        

        //this one doesn't seem right...
        /*onDeath: function() {
            this.currentAnim = this.anims.death;
            ig.game.spawnEntity( EntityWoodSprite, ig.game.startPosition.x, ig.game.startPosition.y);
        },*/

        onDeath: function() {
            this.currentAnim = this.anims.death;
            //also tell game that we died
            //ig.game.spawnEntity(EntityPlayer, this.startPosition.x, this.startPosition.y);
            this.pos.x = this.startPosition.x;
            this.pos.y = this.startPosition.y;
            ig.game.playerDied(this);
            this.lives = this.lives - 1;
            this.respawnStats();

        },
        
        kill: function() {
            //if we have lives, we will pretend we died and respawn instead
            if (this.lives > 1) {
                this.onDeath();
            }
            else{
                this.currentAnim = this.anims.death;
                ig.game.playerDied(this);
                //ig.game.displayDeathMessage();
                this.parent();
                                
            }
            this.outKillOtherPlayers();
        },

        outKillOtherPlayers: function() {
            //right now the server does not have this command,
            //this is for the future if we have to force the 
            //otherplayer clone on the other client to be killed
            //and recreated
            socket.emit('serverKillOthers', this.gamename);
        },

        respawnStats: function() {
            this.health = 100;
            this.armor = 0;
        }
    });
});
