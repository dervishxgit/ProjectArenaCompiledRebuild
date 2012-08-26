ig.module( 'game.levels.mainmenuscreen' )
.requires( 'impact.image','game.entities.startbutton','game.entities.creditsbutton' )
.defines(function(){
LevelMainmenuscreen=/*JSON[*/{"entities":[{"type":"EntityStartbutton","x":420,"y":316,"settings":{"sstate":"GameLobby"}},{"type":"EntityCreditsbutton","x":424,"y":424,"settings":{"sstate":"Credits"}}],"layer":[{"name":"new_layer_0","width":3,"height":2,"linkWithCollision":false,"visible":true,"tilesetName":"media/mainBackground.jpg","repeat":false,"preRender":false,"distance":"1","tilesize":320,"foreground":false,"data":[[1,2,3],[4,5,6]]},{"name":"new_layer_1","width":3,"height":2,"linkWithCollision":false,"visible":true,"tilesetName":"media/mainForeground.png","repeat":false,"preRender":false,"distance":"1","tilesize":320,"foreground":false,"data":[[1,2,3],[4,5,6]]}]}/*]JSON*/;
LevelMainmenuscreenResources=[new ig.Image('media/mainBackground.jpg'), new ig.Image('media/mainForeground.png')];
});