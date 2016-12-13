/**
 * Created by Ariadna on 29/11/2016.
 */
var game = new Phaser.Game(600, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create/*, *update: update*/ });

function preload() {

    game.load.tilemap('mario', 'mapa.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'spritesheet.png');
}

var map;
var layer;
var p;
//var cursors;

function create() {

   /* game.stage.backgroundColor = '#787878';

    map = game.add.tilemap('mario');

    map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');

    layer = map.createLayer('World1');

//    layer.resizeWorld();

    layer.wrap = true;

    cursors = game.input.keyboard.createCursorKeys();
*/
    game.stage.backgroundColor = '#787878';

    //  The 'mario' key here is the Loader key given in game.load.tilemap
    map = game.add.tilemap('mario');

    //  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
    //  The second parameter maps this name to the Phaser.Cache key 'tiles'

    map.addTilesetImage('spritesheet', 'tiles');

    //  Creates a layer from the World1 layer in the map data.
    //  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
    layer = map.createLayer('Tile Layer 1',600,600);
    layer.scale.set(1);


    //  This resizes the game world to match the layer dimensions
    layer.resizeWorld();

}
/*
*function update() {

  if (cursors.left.isDown)
    {
        game.camera.x -= 8;
    }
    else if (cursors.right.isDown)
    {
        game.camera.x += 8;
    }

    if (cursors.up.isDown)
    {
        game.camera.y -= 8;
    }
    else if (cursors.down.isDown)
    {
        game.camera.y += 8;
    }
*/