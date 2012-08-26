//(c)opyright Corydon LaPaz, Steve Miller, Tyler Fuqua

ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'impact.debug.debug',
	'game.levels.teamsplashscreen',
	'game.levels.mainmenuscreen',
	'game.levels.creditsscreen',
	'game.levels.gamelobbyscreen',
	'game.levels.creategamescreen',
	'game.levels.characterselectscreen',
	'game.levels.Arena002',
	'game.levels.Arena004',
	'game.entities.player',
    'game.entities.otherplayer',
    'game.entities.projectile',
    'game.data.projectileLib',
    'game.data.theWeather',
    'game.entities.weatherorb'
	
)
.defines(function(){
//Could not figure out Button entity
//Could not figure out how to create a counter counting down
TeamSplash = ig.Game.extend({
//A fade-in fade-out of a team logo for the class
//OPTIONS: NONE
	init: function() {
		ig.input.bind( ig.KEY.MOUSE1, 'click' );
		this.loadLevel( LevelTeamsplashscreen );
	},
	update: function() {
		this.parent();
	},
	draw: function() {
		this.parent();
	}
});
MainMenu = ig.Game.extend({
//A menu featuring splash art, game name, and interactive text to start the game or open the credits.
//OPTIONS: START(GameLobby) : CREDITS(Credits)
	init: function() {
		this.loadLevel( LevelMainmenuscreen );
	},
	update: function() {
		this.parent();
	},
	draw: function() {
		this.parent();
	}
});
Credits = ig.Game.extend({
//A simple screen featuring all participants names, roles, and acknoledgements with a button to go back.
//OPTIONS: BACK(MainMenu)
	init: function() {
		this.loadLevel( LevelCreditsscreen );
	},
	update: function() {
		this.parent();
	},
	draw: function() {
		this.parent();
	}
});
GameLobby = ig.Game.extend({
//An interactive screen that features an actively updating list of all available games, local and web. Inside the interactive area is a button to join for each game found. At the bottom of the page are 2 buttons to go back or create a game to be displayed in the interactive area for other players.
//OPTIONS: CREATE(CreateGame), BACK(MainMenu), JOIN(CharacterSelect)
	init: function() {
		this.loadLevel( LevelGamelobbyscreen );
	},
	update: function() {
		this.parent();
	},
	draw: function() {
		this.parent();
	}
});
CreateGame = ig.Game.extend({
//A simple screen that lets you give your game a name. Features 2 buttons to go back or to create a game with the desired name. This game will be displayed in the interactive area of (GameLobby) under that name, if the name is already in use it will return an error.
//OPTIONS: CREATE(CharacterSelect), BACK(GameLobby)
	init: function() {
		this.loadLevel( LevelCreategamescreen );
	},
	update: function() {
		this.parent();
	},
	draw: function() {
		this.parent();
	}
});
CharacterSelect = ig.Game.extend({
//A more complicated screen. It displays the name of the game you're in, the name entered by the host, at the top; a character display and selector at the left, using 2 arrow buttons; a trait selector below that, using 6 buttons; a lobby chat to the right of the character selector; A list of connected players on the right; 2 buttons at the botom right to mark yourself as ready or go back. Both players must mark themselves as 'ready' for that function to pass, if one is ready it holds.
//OPTIONS: READY(MyGame), BACK(GameLobby)
	init: function() {
		this.loadLevel( LevelCharacterselectscreen );
	},
	update: function() {
		this.parent();
	},
	draw: function() {
		this.parent();
	}
});
// MyGame = ig.Game.extend({	
	// font: new ig.Font( 'media/04b03.font.png' ),	
	// init: function() {
		// // Initialize your game here; bind keys etc.
	// },
	// update: function() {
		// this.parent();
	// },	
	// draw: function() {
		// // Draw all entities and backgroundMaps
		// this.parent();	
		// // Add your own drawing code here
		// var x = ig.system.width/2,
			// y = ig.system.height/2;		
		// this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );
	// }
// });

MyGame = ig.Game.extend({

        gravity: 1000,
        // Load a font
        //font: new ig.Font( 'media/04b03.font.png' ),
        font: new ig.Font('media/04b04.font.png'),

        playerList: {
            thisPlayer: null,
            otherPlayer: null
        },

        projectileLib: {},
        theWeather: null,

        playerPollTimer:  null,
        playerPollTimerInterval: 0.25,
        gameDebugTimer: null,

        init: function () {
            ig.game = this;
            /*// Initialize your game here; bind keys etc.
            ig.input.bind( ig.KEY.A, 'left' );
            ig.input.bind( ig.KEY.D, 'right' );
            ig.input.bind( ig.KEY.W, 'up' );
            ig.input.bind( ig.KEY.S, 'down' );
            //this.loadLevel (LevelLevel1);
            //this.loadLevel (LevelTestlevel01);
            //this.loadLevel (LevelBlank);
            this.loadLevel (LevelTest03Large);*/

            // Bind keys
            ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
            ig.input.bind(ig.KEY.X, 'jump');
            ig.input.bind( ig.KEY.C, 'shoot' );
            ig.input.bind(ig.KEY.DOWN_ARROW, 'down');

            // Load the LevelTest as required above ('game.level.test')
            //this.loadLevel( LevelTest );
            //this.loadLevel(LevelTest02);
            //this.loadLevel(LevelTest03Large);
            this.loadLevel(LevelArena002);
            //this.loadLevel(LevelArena003);
            //this.loadLevel(LevelArena004);
            //this.loadLevel(LevelArenablank);

            this.projectileLib = new ClassProjectilelib;
            this.theWeather = new ClassTheWeather('selector');
            this.playerPollTimer = new ig.Timer();
            this.gameDebugTimer = new ig.Timer();


        },

        update: function () {
            // Update all entities and backgroundMaps
            this.parent();

           

            // Add your own, additional update code here
            if(!this.playerList.thisPlayer || 
            	this.playerList.thisPlayer == null ||
            	this.playerList.thisPlayer == undefined){
                this.playerList.thisPlayer = this.getEntitiesByType(EntityPlayer)[0];
            }

            if (!this.playerList.otherPlayer ||
            	this.playerList.otherPlayer == null ||
            	this.playerList.otherPlayer == undefined){
                this.playerList.otherPlayer = this.getEntitiesByType(EntityOtherplayer)[0];
            }

            if (this.playerList.thisPlayer) {
                this.screen.x = this.playerList.thisPlayer.pos.x - ig.system.width / 2;
                this.screen.y = this.playerList.thisPlayer.pos.y - ig.system.height / 2;
            }

            //testing output and states
            if (this.gameDebugTimer.delta() > 2) {
                //console.log(this.playerList.thisPlayer.maxVel.x, this.playerList.thisPlayer.maxVel.y);
                
                this.gameDebugTimer.reset();
            }

            //weather
            //update weather
            this.theWeather.update();

            //console.log(this.playerList.otherPlayer);
            this.cullOtherPlayers();

        },

        draw: function () {
            // Draw all entities and backgroundMaps
            this.parent();

            //var player = this.getEntitiesByType(EntityPlayer)[0];
            //var otherplayer = this.getEntityByName('otherplayer');
            // Add your own drawing code here
            this.playerList.thisPlayer.messageboxtimer = this.playerList.thisPlayer.messageboxtimer - 1;

            if(this.playerList.thisPlayer.messageboxtimer < 1)
            {
                this.playerList.thisPlayer.messageboxtimer = 150;
                var newtext = "";
                var newsplit = this.playerList.thisPlayer.messagebox.split("\n");
                for(var i = 0;i < newsplit.length; i++)
                {
                    if(i > 1)
                    {
                        newtext = newtext + "\n" + newsplit[i];
                    }
                }
    		
                this.playerList.thisPlayer.messagebox = newtext;
            }

            this.font.draw('Arrow Keys, X, C', 2, 2);
            this.font.draw( this.playerList.thisPlayer.messagebox, 350, 10);
            this.font.draw('Health: ' + this.playerList.thisPlayer.health, 2, 32);
            this.font.draw('Armor: ' + this.playerList.thisPlayer.armor, 2, 64);
            this.font.draw('Lives: ' + this.playerList.thisPlayer.lives, 2, 96);

            //debug other player stats
            if (this.playerList.otherPlayer) {
	            this.font.draw('otherplayer health: ' + this.playerList.otherPlayer.health, 2, 128 );
	            this.font.draw('otherplayer armor: ' + this.playerList.otherPlayer.armor, 2, 152);
                this.font.draw('otherplayer lives: ' + this.playerList.otherPlayer.lives, 2, 196);
            	
            }

            this.theWeather.drawWeatherState();
        },

        sendOutMessage: function(funcString, argString) {
            //outgoing message
            if (argString || argString != null || argString != undefined) {
                socket.emit(funcString, argString);
            } else {
                socket.emit(funcString /*,args*/);
            }
        },

        playerDied: function(player) {
        	//if (player) {
        		
	        	this.playerList.thisPlayer = null;
                console.log('called player died');
	       	
	       		/*else if (player == this.playerList.otherPlayer) {
	       			this.playerList.otherPlayer = null;
	       		}*/
        	//}
        },

        otherPlayerDied: function(player) {
        	//if (player) {
        		this.playerList.otherPlayer = null;
                console.log('called other player died');
        	//}
        },

        getOtherPlayer: function() {
        	if (this.playerPollTimer.delta() > this.playerPollTimerInterval) {
        		this.playerList.otherPlayer = ig.game.getEntitiesByType('EntityOtherplayer')[0];
        		this.playerPollTimer.set();
                console.log('got other player');
        	}
        },

        cullOtherPlayers: function() {
            //test function to make sure there is only one otherplayer in the game
            var otherArray = ig.game.getEntitiesByType('EntityOtherplayer');
            for (var i = 1; i < otherArray.length; i++) {
                otherArray[i].kill();
                console.log('killed another player');
            }
        }

    });

WinScreen = ig.Game.extend({
//A slightly transparent screen with a win graphic, press 'key' to continue.
//OPTIONS: CONTINUE(MainMenu)
	Background: new ig.Image( 'media/winBackground.jpg' ),
	Foreground: new ig.Image( 'media/winForeground.png' ),
	init: function() {
	
	},
	update: function() {
		if(ig.input.released('continue')){
			ig.system.setGame(MyGame)
		};
		this.parent();
	},
	draw: function() {
		this.parent();
		this.Background.draw( 0, 0 );
		this.Foreground.draw( 0, 0 );
	}
});
LooseScreen = ig.Game.extend({
//A slightly transparent screen with a loss graphic, press 'key' to continue.
//OPTIONS: CONTINUE(MainMenu)
	Background: new ig.Image( 'media/loseBackground.jpg' ),
	Foreground: new ig.Image( 'media/loseForeground.png' ),
	init: function() {
	
	},
	update: function() {
		if(ig.input.released('continue')){
			ig.system.setGame(MyGame)
		};
		this.parent();
	},
	draw: function() {
		this.parent();
		this.Background.draw( 0, 0 );
		this.Foreground.draw( 0, 0 );
	}
});
// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 960, 640, 1 );
});