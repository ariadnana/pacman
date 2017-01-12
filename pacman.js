/**
 * Created by Ariadna on 29/11/2016.
 */
var c_width=28*16;
var c_hight=31*16;
var game = new Phaser.Game(c_width, c_hight, Phaser.AUTO, 'phaser-example');

var Pacman = function(game){
    this.map=null;
    this.pacman=null;
    this.layer=null;
    this.ghosts=[];
    this.safetiles = [7,14];
    this.gridsize = 16;
    this.numDots = 0;


    this.speed = 100;
    this.threshold = 3;

    this.marker = new Phaser.Point();
    this.turnPoint = new Phaser.Point();

    this.directions = [ null, null, null, null, null ];
    this.opposites = [ Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP ];

    this.current = Phaser.NONE;
    this.turning = Phaser.NONE;
    this.timer=0;

};

Pacman.prototype = {

    init: function () {
        this.stage.backgroundColor = '#787878';
        this.scale.setShowAll();
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

        this.physics.startSystem(Phaser.Physics.ARCADE);
    },

    preload: function () {
        this.load.image('dot', 'dot.png');
        this.load.spritesheet('fruit','fruit.png',16,16);
        this.load.tilemap('map', 'mapa2.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'spritesheet2.png');
        this.load.spritesheet('pacman', 'pacman.png', 16,16);
        this.load.spritesheet('g1','g1.png',16,16);
        this.load.spritesheet('g2','g2.png',16,16);
        this.load.spritesheet('g3','g3.png',16,16);
        this.load.spritesheet('g4','g4.png',16,16);
    },

    create: function () {
        this.score = 0;
        this.scoreText = null;
        this.level =1;
        this.lvlText = null;

        this.map = game.add.tilemap('map');
        this.map.addTilesetImage('pacman-tiles', 'tiles');
        this.layer = this.map.createLayer('Capa de Patrones 1');
        this.dots = game.add.physicsGroup();

        this.numDots = this.map.createFromTiles(7, 14, 'dot', this.layer, this.dots);
        this.TOTAL_DOTS = this.numDots;
        this.dots.setAll('x',6, false,false,1);
        this.dots.setAll('y',6,false,false,1);

        this.map.setCollisionByExclusion([7,14],true,this.layer);

        this.pacman = this.add.sprite((13 * 16) + 8, (19 * 16) + 8, 'pacman', 0);
        this.pacman.anchor.set(0.5);
        this.pacman.animations.add('munch', [0, 1, 2, 1], 20, true);
        this.pacman.isdead=false;

        this.fruits=game.add.physicsGroup();
        this.fruits.create((0.2*16)+8,(6.2*16)+8,'fruit');
        this.fruits.create((0.2*16)+8,(23.2*16)+8,'fruit');
        this.fruits.create((25.2*16)+8,(6.2*16)+8,'fruit');
        this.fruits.create((25.2*16)+8,(23.2*16)+8,'fruit');

        this.physics.arcade.enable(this.pacman);
        this.pacman.body.setSize(13, 13, 0, 0);

        var style ={font: "24px Arial", fill: "#fff", boundsAlignH: "center"};
        this.scoreText = game.add.text(14*16, 17*16, "Score: " + this.score, style);
        this.scoreText.anchor.set(0.5);
        this.lvlText = game.add.text(14*16, 8.5*16, "Level: " + this.level, style);
        this.lvlText.anchor.set(0.5);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);this.space.onDown.add(function() {
            game.paused = !game.paused;}, this);
        this.enter=this.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        this.pacman.play('munch');
        this.move(Phaser.LEFT);

        g1=new Ghost(this, 'g1','g1',{x:1,y:1},Phaser.RIGHT);
        g2=new Ghost(this, 'g2','g2',{x:1,y:29},Phaser.RIGHT);
        g3=new Ghost(this, 'g3','g3',{x:26,y:1},Phaser.LEFT);
        g4=new Ghost(this, 'g4','g4',{x:26,y:29},Phaser.LEFT);
        this.ghosts.push(g1,g2,g3,g4);
        for (i=0; i<this.ghosts.length; i++){
            this.ghosts[i].ghost.mode=1;
        }
    },

    checkKeys: function () {

        if (this.cursors.left.isDown && this.current !== Phaser.LEFT)
        {
            this.checkDirection(Phaser.LEFT);
        }
        else if (this.cursors.right.isDown && this.current !== Phaser.RIGHT)
        {
            this.checkDirection(Phaser.RIGHT);
        }
        else if (this.cursors.up.isDown && this.current !== Phaser.UP)
        {
            this.checkDirection(Phaser.UP);
        }
        else if (this.cursors.down.isDown && this.current !== Phaser.DOWN)
        {
            this.checkDirection(Phaser.DOWN);
        }
        else
        {
            //  This forces them to hold the key down to turn the corner
            this.turning = Phaser.NONE;
        }

    },

    checkDirection: function (turnTo) {

        if (this.turning === turnTo || this.directions[turnTo] === null || (this.directions[turnTo].index !== 7 && this.directions[turnTo].index !== 14))
        {
            //  Invalid direction if they're already set to turn that way
            //  Or there is no tile there, or the tile isn't index 1 (a floor tile)
            return;
        }

        //  Check if they want to turn around and can
        if (this.current === this.opposites[turnTo])
        {
            this.move(turnTo);
        }
        else
        {
            this.turning = turnTo;
            this.turnPoint.x = (this.marker.x * this.gridsize) + (this.gridsize / 2);
            this.turnPoint.y = (this.marker.y * this.gridsize) + (this.gridsize / 2);
        }

    },

    turn: function () {

        var cx = Math.floor(this.pacman.x);
        var cy = Math.floor(this.pacman.y);

        //  This needs a threshold, because at high speeds you can't turn because the coordinates skip past
        if (!this.math.fuzzyEqual(cx, this.turnPoint.x, this.threshold) || !this.math.fuzzyEqual(cy, this.turnPoint.y, this.threshold))
        {
            return false;
        }

        //  Grid align before turning
        this.pacman.x = this.turnPoint.x;
        this.pacman.y = this.turnPoint.y;

        this.pacman.body.reset(this.turnPoint.x, this.turnPoint.y);

        this.move(this.turning);

        this.turning = Phaser.NONE;

        return true;

    },

    move: function (direction) {

        var speed = this.speed;

        if (direction === Phaser.LEFT || direction === Phaser.UP)
        {
            speed = -speed;
        }

        if (direction === Phaser.LEFT || direction === Phaser.RIGHT)
        {
            this.pacman.body.velocity.x = speed;
        }
        else
        {
            this.pacman.body.velocity.y = speed;
        }

        //  Reset the scale and angle (Pacman is facing to the right in the sprite sheet)
        this.pacman.scale.x = 1;
        this.pacman.angle = 0;

        if (direction === Phaser.LEFT)
        {
            this.pacman.scale.x = -1;
        }
        else if (direction === Phaser.UP)
        {
            this.pacman.angle = 270;
        }
        else if (direction === Phaser.DOWN)
        {
            this.pacman.angle = 90;
        }

        this.current = direction;

    },

    eatDot: function (pacman, dot) {

        dot.kill();
        this.score=this.score+10;

        if (this.dots.total === 0)
        {
            this.dots.callAll('revive');
            this.speed=this.speed+150;
            this.level=this.level+1;
        }

    },

    Dead: function (pacman, ghost) {
        if (ghost.mode==1)
        {
            pacman.kill();
            pacman.isdead=true;
        }
        else{
            ghost.kill();
            ghost.mode=3;
        }

    },

    update: function () {
        if (!this.pacman.isdead) {
            this.physics.arcade.collide(this.pacman, this.layer);
            this.physics.arcade.overlap(this.pacman, this.dots, this.eatDot, null, this);
            for (var i = 0; i < this.ghosts.length; i++) {
                if (this.ghosts[i].ghost.mode != 3) {
                    this.physics.arcade.overlap(this.pacman, this.ghosts[i].ghost, this.Dead, null, this);
                }
            }
            this.game.physics.arcade.overlap(this.pacman, this.fruits, this.eatfruit, null, this);

            this.marker.x = this.math.snapToFloor(Math.floor(this.pacman.x), this.gridsize) / this.gridsize;
            this.marker.y = this.math.snapToFloor(Math.floor(this.pacman.y), this.gridsize) / this.gridsize;

            //  Update our grid sensors
            this.directions[1] = this.map.getTileLeft(this.layer.index, this.marker.x, this.marker.y);
            this.directions[2] = this.map.getTileRight(this.layer.index, this.marker.x, this.marker.y);
            this.directions[3] = this.map.getTileAbove(this.layer.index, this.marker.x, this.marker.y);
            this.directions[4] = this.map.getTileBelow(this.layer.index, this.marker.x, this.marker.y);

            this.scoreText.setText("Score: " + this.score);
            this.lvlText.setText("Level: " + this.level);

            this.checkKeys();

            if (this.turning !== Phaser.NONE) {
                this.turn();
            }

            this.updateGhosts();
            if (this.timer === 1) {
                for (var i = 0; i < this.ghosts.length; i++) {
                    this.ghosts[i].fipor();
                }
            }
            if (this.timer !== 0) this.timer = this.timer - 1;
        }
        else{
            var style ={font: "24px Arial", fill: "#fff", boundsAlignH: "center"};
            this.start = game.add.text(14*16, 15.5*16, "Press enter to start", style);
            this.start.anchor.set(0.5);
            if(this.enter.isDown){
                console.log("hola");
                game.create();
            }
        }
    },

    eatfruit: function(pacman,fruits){
        fruits.kill();
        for(var i=0; i<this.ghosts.length; i++){
            this.ghosts[i].inicipor();
        }
        this.timer=250;
    },

    updateGhosts: function () {
        for (var i = 0; i < this.ghosts.length; i++) {
            if(this.ghosts[i].ghost.mode !=3){
                this.ghosts[i].update();
            }
        }
    }
};

game.state.add('Game',Pacman, true);
