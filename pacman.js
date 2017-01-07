/**
 * Created by Ariadna on 29/11/2016.
 */
var c_width=28*16;
var c_hight=31*16;
var game = new Phaser.Game(c_width, c_hight, Phaser.AUTO, 'phaser-example', { preload: preload, create: create/*, update: update*/ });

function preload() {
    game.load.image('dot', 'dot.png');
    game.load.tilemap('mario', 'mapa2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'spritesheet2.png');
    game.load.spritesheet('pacman','pacman.png', 32,32);
}

var map;
var layer;

function create() {
    game.stage.backgroundColor = '#787878';
    //game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setShowAll();
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVeritcally = true;
    game.scale.refresh();

    //  The 'mario' key here is the Loader key given in game.load.tilemap
    map = game.add.tilemap('mario');
    //  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
    //  The second parameter maps this name to the Phaser.Cache key 'tiles'
    map.addTilesetImage('pacman-tiles', 'tiles');
    //  Creates a layer from the World1 layer in the map data.
    //  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
    layer = map.createLayer('Capa de Patrones 1');
    layer.wrap = true;
    dots = game.add.physicsGroup();

    map.createFromTiles(7,14,'dot',layer, dots);
    dots.setAll('x',6, false,false,1);
    dots.setAll('y',6,false,false,1);

    pacman = this.add.sprite((13 * 16) + 8, (19 * 16) + 8, 'pacman', 0);
    pacman.scale.setTo(1,1);
    pacman.animations.add('munch', [0, 1, 2, 1], 20, true);
    pacman.play('munch');

}

/*function update() {

    if (cursors.left.isDown) {
        game.camera.x -= 8;
    }
    else if (cursors.right.isDown) {
        game.camera.x += 8;
    }

    if (cursors.up.isDown) {
        game.camera.y -= 8;
    }
    else if (cursors.down.isDown) {
        game.camera.y += 8;
    }

}*/

