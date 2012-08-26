ig.module( 'game.levels.creditsscreen' )
.requires( 'impact.image','game.entities.backbutton' )
.defines(function(){
LevelCreditsscreen=/*JSON[*/{"entities":[{"type":"EntityBackbutton","x":444,"y":352,"settings":{"sstate":"MainMenu"}}],"layer":[{"name":"new_layer_0","width":3,"height":2,"linkWithCollision":false,"visible":1,"tilesetName":"media/creditsBackground.jpg","repeat":false,"preRender":false,"distance":"1","tilesize":320,"foreground":false,"data":[[1,2,3],[4,5,6]]},{"name":"new_layer_1","width":3,"height":2,"linkWithCollision":false,"visible":true,"tilesetName":"media/creditsCredits.jpg","repeat":false,"preRender":false,"distance":"1","tilesize":320,"foreground":false,"data":[[0,0,0],[1,2,0]]}]}/*]JSON*/;
LevelCreditsscreenResources=[new ig.Image('media/creditsBackground.jpg'), new ig.Image('media/creditsCredits.jpg')];
});