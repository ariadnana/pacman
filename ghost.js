/**
 * Created by Ariadna on 8/1/2017.
 */
var Ghost =function(game, key,name, pos, dir){
    this.game=game;
    this.key=key;
    this.name=name;

    this.gridsize = this.game.gridsize;
    this.Dir = dir;
    this.Pos = pos;
    this.threshold = 6;
    this.turnTimer=0;
    this.mode=1;

    this.ghostSpeed=150;
    this.currentDir=this.Dir;
    this.directions=[null, null, null, null, null];
    this.turnPoint = new Phaser.Point();

    this.ghost = this.game.add.sprite((this.Pos.x * 16) + 8, (this.Pos.y * 16) + 8, key, 0);
    this.ghost.name = this.name;
    this.ghost.anchor.set(0.5);
    this.ghost.animations.add('change',[0,1,6,7,2,3,4,5],10, true);
    this.ghost.animations.add('f',[9,10],10, true);
    this.ghost.play('change');
    this.game.physics.arcade.enable(this.ghost);
    this.move(this.Dir);
};

//noinspection JSAnnotator,JSAnnotator
Ghost.prototype={
    update: function () {
        this.game.physics.arcade.collide(this.ghost, this.game.layer);
        var a = this.game.math.snapToFloor(Math.floor(this.game.pacman.x), this.gridsize) / this.gridsize;
        var b = this.game.math.snapToFloor(Math.floor(this.game.pacman.y), this.gridsize) / this.gridsize;
        pacmanpos= new Phaser.Point((a * this.gridsize) + (this.gridsize / 2), (b * this.gridsize) + (this.gridsize / 2));
        var x = this.game.math.snapToFloor(Math.floor(this.ghost.x), this.gridsize) / this.gridsize;
        var y = this.game.math.snapToFloor(Math.floor(this.ghost.y), this.gridsize) / this.gridsize;

        this.directions[0]=this.game.map.getTile(x,y, this.game.layer);
        this.directions[1]=this.game.map.getTileLeft(this.game.layer.index, x, y) || this.directions[1];
        this.directions[2] = this.game.map.getTileRight(this.game.layer.index, x, y) || this.directions[2];
        this.directions[3] = this.game.map.getTileAbove(this.game.layer.index, x, y) || this.directions[3];
        this.directions[4] = this.game.map.getTileBelow(this.game.layer.index, x, y) || this.directions[4];

        var possibleExits=[];
        for (var q=1; q<this.directions.length; q++) {
            if (this.checkSafetile(this.directions[q].index)) {
                possibleExits.push(q);
            }
        }

        switch (this.mode){
            case 1:
                var distanceToObj = 999999;
                var direction, decision, bestDecision;
                for (q=0; q<possibleExits.length; q++) {
                    direction = possibleExits[q];
                    switch (direction) {
                        case Phaser.LEFT:
                            decision = new Phaser.Point((x-1)*this.gridsize + (this.gridsize/2),
                                (y * this.gridsize) + (this.gridsize / 2));
                            break;
                        case Phaser.RIGHT:
                            decision = new Phaser.Point((x+1)*this.gridsize + (this.gridsize/2),
                                (y * this.gridsize) + (this.gridsize / 2));
                            break;
                        case Phaser.UP:
                            decision = new Phaser.Point(x * this.gridsize + (this.gridsize/2),
                                ((y-1)*this.gridsize) + (this.gridsize / 2));
                            break;
                        case Phaser.DOWN:
                            decision = new Phaser.Point(x * this.gridsize + (this.gridsize/2),
                                ((y+1)*this.gridsize) + (this.gridsize / 2));
                            break;
                        default:
                            break;
                    }
                    var dist = pacmanpos.distance(decision);
                    if (dist < distanceToObj) {
                        bestDecision = direction;
                        distanceToObj = dist;
                    }
                }

                this.turnPoint.x = (x * this.gridsize) + (this.gridsize / 2);
                this.turnPoint.y = (y * this.gridsize) + (this.gridsize / 2);

                // snap to grid exact position before turning
                this.ghost.x = this.turnPoint.x;
                this.ghost.y = this.turnPoint.y;

                this.lastPosition = { x: x, y: y };

                //this.ghost.body.reset(this.turnPoint.x, this.turnPoint.y);
                this.move(bestDecision);
                break;
            case 2:
                var distanceToObj = 999999;
                var direction, Decision;
                direction = possibleExits[Math.floor(Math.random()*possibleExits.length)];
                switch (direction) {
                    case Phaser.LEFT:
                        decision = new Phaser.Point((x-1)*this.gridsize + (this.gridsize/2),
                            (y * this.gridsize) + (this.gridsize / 2));
                        break;
                    case Phaser.RIGHT:
                        decision = new Phaser.Point((x+1)*this.gridsize + (this.gridsize/2),
                            (y * this.gridsize) + (this.gridsize / 2));
                        break;
                    case Phaser.UP:
                        decision = new Phaser.Point(x * this.gridsize + (this.gridsize/2),
                            ((y-1)*this.gridsize) + (this.gridsize / 2));
                        break;
                    case Phaser.DOWN:
                        decision = new Phaser.Point(x * this.gridsize + (this.gridsize/2),
                            ((y+1)*this.gridsize) + (this.gridsize / 2));
                        break;
                    default:
                        break;
                }

                this.turnPoint.x = (x * this.gridsize) + (this.gridsize / 2);
                this.turnPoint.y = (y * this.gridsize) + (this.gridsize / 2);

                // snap to grid exact position before turning
                this.ghost.x = this.turnPoint.x;
                this.ghost.y = this.turnPoint.y;

                this.lastPosition = { x: x, y: y };

                //this.ghost.body.reset(this.turnPoint.x, this.turnPoint.y);
                this.move(Decision);
                break;

        }
    },
    move: function(dir) {
        this.currentDir = dir;

        var speed = this.ghostSpeed;
        if (dir === Phaser.LEFT || dir === Phaser.UP) {
            speed = -speed;
        }
        if (dir === Phaser.LEFT || dir === Phaser.RIGHT) {
            this.ghost.body.velocity.x = speed;
        } else {
            this.ghost.body.velocity.y = speed;
        }
    },

    inicipor: function(){
        if(this.mode !== 3){
            this.ghost.play('f');
            this.mode=2;
        }
    },

    fipor: function () {
        if(this.mode !== 3){
            this.ghost.play('change');
            this.mode=1;
        }
    },

    checkSafetile: function(tileIndex) {
            if ( tileIndex===7 || tileIndex===14) {
                return true;
            }
        return false;
    },
    getPosition: function() {
        var x = this.game.math.snapToFloor(Math.floor(this.ghost.x), this.gridsize) / this.gridsize;
        var y = this.game.math.snapToFloor(Math.floor(this.ghost.y), this.gridsize) / this.gridsize;
        return new Phaser.Point((x * this.gridsize) + (this.gridsize / 2), (y * this.gridsize) + (this.gridsize / 2));
    }
};