//(c)opyright  2012 - Steve Miller

var app = require('http').createServer(handler)
, io = require('socket.io').listen(app)
, fs = require('fs')


app.listen(8080);

////////////////////
//some globals for the server
var playerlocation = 0;
var playerlist = [];
var projectileNetList = [];




function handler(req, res) {
    fs.readFile(__dirname + '/index.html',
    function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }

        res.writeHead(200);
        res.end(data);
    });
}

/////////////////////////////////
//on connection from a client
io.sockets.on('connection', function (socket) {



    socket.on('recievedata', function (
        /*positionx, 
        positiony, 
        currentanimation,
        flipState, 
        gamename*/argsArray) 
    {
        socket.broadcast.emit('playermove', 
            /*positionx, 
            positiony, 
            currentanimation,
            flipState, 
            gamename, 0, 1, 2*/
            argsArray);

        //socket.broadcast.emit('testUpdateMessage', argsArray.gamename);


    });




    //////////////////////////////////////////////
    //commands called to server (this is the server!)
    socket.on('initializeplayer', function (newplayername) {

        socket.clientname = newplayername;
        playerlist.push(newplayername);
        io.sockets.emit('addplayer', playerlist, newplayername);


    });

    socket.on('serverInitializeNetProjectile', function(/*args*/){
        //what we should do here is get the spawner (the original socket)
        //and make sure that it is passed as a reference to trace back to
        //beyond that we want as little relevant info as possible

        //important to the other client:
        //facing or travel direction, projectile (or attack) type,
        //in the future the attack type will dictate a lot about the spawned projectile
        //as in whether it should watch its spawner, etc. so for now we will only spawn
        //one type

        socket.broadcast.emit('clientSpawnNetProjectileCopy' /*,args*/);
        console.log("sending spawn message");

    });

    socket.on('serverBroadCastWeatherOrbTouched', function(bool){
        socket.broadcast.emit('clientSetWeatherOrbTouched', bool);
    });

    socket.on('serverBroadCastWeatherType' , function(weatherType) {
        socket.broadcast.emit('clientSetWeatherType', weatherType);
    });

    ///////////////////////////////////////////
    //on disconnect from a client
    socket.on('disconnect', function () {
        delete playerlist[socket.clientname];
        for (var i in playerlist) {
            if (playerlist[i] == socket.clientname) {
                playerlist.splice(i, 1);
            }
        }
        socket.broadcast.emit('disconnectmessage', socket.clientname);
        //socket.broadcast.emit('netreplayer', playerlist);



    });



});