ig.module( 'game.levels.creategamescreen' )
.requires( 'impact.image','game.entities.backbutton','game.entities.createbutton' )
.defines(function(){
LevelCreategamescreen=/*JSON[*/{"entities":[{"type":"EntityBackbutton","x":460,"y":384,"settings":{"sstate":"GameLobby"}},{"type":"EntityCreatebutton","x":452,"y":216,"settings":{"sstate":"CharacterSelect"}}],"layer":[{"name":"new_layer_0","width":3,"height":2,"linkWithCollision":false,"visible":1,"tilesetName":"media/createLobbyBackground.jpg","repeat":false,"preRender":false,"distance":"1","tilesize":320,"foreground":false,"data":[[1,2,3],[4,5,6]]},{"name":"new_layer_1","width":3,"height":2,"linkWithCollision":false,"visible":true,"tilesetName":"media/createLobbyCreate.jpg","repeat":false,"preRender":false,"distance":"1","tilesize":320,"foreground":false,"data":[[0,0,0],[1,0,0]]}]}/*]JSON*/;
LevelCreategamescreenResources=[new ig.Image('media/createLobbyBackground.jpg'), new ig.Image('media/createLobbyCreate.jpg')];
});