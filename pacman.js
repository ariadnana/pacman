/**
 * Created by Ariadna on 29/11/2016.
 */
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.tilemap('mario', 'mapa.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'spritesheet.png');

}

var map;
var layer;
var p;
var cursors;

function create() {

    game.stage.backgroundColor = '#787878';

    map = game.add.tilemap('mario');

    map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');

    layer = map.createLayer('World1');

//    layer.resizeWorld();

    layer.wrap = true;

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

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

}