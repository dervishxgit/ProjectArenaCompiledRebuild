//(c)opyright  2012 - Steve Miller

var namerand = Math.floor(Math.random() * 999);
var playername = "player" + namerand;

//var ig = require('ig');




var socket = io.connect('http://localhost:8080');

socket.on('disconnectmessage', function (data) {
    var player = ig.game.getEntitiesByType(EntityPlayer)[0];
    if (player) {
        player.messagebox = player.messagebox + '\n' + data + ' disconnected';
    }
});

socket.on('playermove', function (
        /*positionx, 
        positiony, 
        currentanimation, 
        flipState, 
        thisgamename, numberone, numbertwo, numberthree*/
        argsArray
        ) 
{
    //console.log(argsArray);
    var otherplayer = ig.game.getEntitiesByType('EntityOtherplayer')[0];
    //var otherplayer = ig.game.getEntityByName('otherplayer');
    //var otherplayer = ig.game.playerList.otherPlayer;
    /*console.log(argsArray.numberone, argsArray.numbertwo, argsArray.numberthree);
    console.log(
        argsArray.positionx, 
        argsArray.positiony, 
        argsArray.currentanimation,
        argsArray.flipState,
        argsArray.thisgamename);*/
    //console.log(otherplayer, otherplayer.gamename);
    /*if (otherplayer) {
        console.log(argsArray.gamename, otherplayer.gamename);
        for (var i in otherplayer) {

            if (argsArray.thisgamename == otherplayer[i].gamename) {
                otherplayer[i].pos.x = argsArray.positionx;
                otherplayer[i].pos.y = argsArray.positiony;

                otherplayer[i].incSetNetAnim(argsArray.iNetAnim);
                otherplayer[i].flip = argsArray.flip;
            } 
        } 
    }*/

    if (otherplayer) {
        var health = argsArray.health;
        var armor = argsArray.armor;
        var lives = argsArray.lives;
        otherplayer.pos.x = argsArray.positionx;
        otherplayer.pos.y = argsArray.positiony;
        otherplayer.incSetNetAnim(argsArray.iNetAnim);
        otherplayer.flip = argsArray.flip;
        otherplayer.setHealth(health);
        otherplayer.setArmor(armor);
        otherplayer.setLives(lives);    
    }
});



socket.on('netreplayer', function (playerlist) {
    var netplayers = ig.game.getEntitiesByType('EntityOtherplayer');
    //var netplayers = ig.game.getEntityByName("otherplayer");
    //////////////loop to see if players exist
    if (netplayers) {
        for (var i in netplayers) {
            netplayers[i].kill();
        } 
    }

    for (var i in playerlist) {
        if (playername != playerlist[i]) {
            ig.game.spawnEntity(EntityOtherplayer, 400, 400, { gamename: playerlist[i] });
        }
    }

    /////////////////////////////////
});

socket.on('clientSpawnNetProjectileCopy', function(/*args*/) {
    //get the other player entity and have them spawn a projectilenetcopy
    //var otherplayer = ig.game.getEntityByName('otherplayer');
    //console.log("received spawn notice");
    //var otherplayer = ig.game.getEntityByName('otherplayer');
    var otherplayer = ig.game.getEntitiesByType('EntityOtherplayer')[0];
    if (otherplayer){
        otherplayer.incSpawnProjectileNetCopy(/*args*/);
    }
    
});

socket.on('clientSetWeatherOrbTouched', function(bool){
    ig.game.theWeather.setOrbTouched(true);
});

socket.on('clientSetWeatherType', function(weatherType){
    ig.game.theWeather.selectWeatherType(weatherType);
});

socket.on('addplayer', function (playerlist, otherplayername) {
    var player = ig.game.getEntitiesByType(EntityPlayer)[0];
    player.messagebox = player.messagebox + '\n' + otherplayername + ' joined';
    for (var i = 0; i < playerlist.length; i++) {
        if (player.gamename != playerlist[i]) {
            ig.game.spawnEntity(EntityOtherplayer, 0, 0, { gamename: playerlist[i] });


        } 
    }

});

socket.on('testUpdateMessage', function(playername) {
	var player = ig.game.getEntitiesByType('EntityPlayer')[0];
        //var name = gamename.toString();
        if(player) {
          player.messagebox = player.messagebox + '\n' + playername + ' updatedPosition';
        }
}); 		