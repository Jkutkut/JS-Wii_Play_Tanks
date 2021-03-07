// Variables to keep in mind: 
//  - mainCanvasWidth
//  - mainCanvasHeight

const sizes = {
    margin: 10,
    wallWidth: 15,
    wallSizeN: 20
}


var levels = [
    {
        // constructor (x, y, colorId = 0, sizeId = 0)
        player: [0.08, 0.5],
        // constructor (x, y, w, h, angle=0)
        walls: [
            [0.5, 0.5, sizes.wallSizeN, 0.4, 0]
        ],
        // constructor(x, y, colorId = 0, sizeId = 0)
        AItanks: [
            [0.8, 0.5, 1],
        ]
    },
    {
        player: [0.3, 0.5],
        walls: [
            [0.335, 0.25, 0.35, sizes.wallSizeN, 0],
            [0.5, 0.5, sizes.wallSizeN, 0.475, 0],
            [0.6673, 0.75, 0.35, sizes.wallSizeN, 0]
        ],
        AItanks: [
            [0.7, 0.5, 1],
        ]
    }

];

function loadLevel(lvl) {
    let level = levels[lvl - 1];
    let conv = function(p) {
        let v = [p[0] * mainCanvasWidth, p[1] * mainCanvasHeight];
        if (p.length > 2) {
            for (let i = 2; i < p.length; i++){
                v.push(p[i]);
            }
        }
        return v;
    }
    let wallConv = function(p) {
        p = conv(p);
        if (p[2] % 1 != 0) {
            p[2] *= mainCanvasWidth;
        }
        if (p[3] % 1 != 0) {
            p[3] *= mainCanvasHeight;
        }
        return p;
    }

    tank = new Tank(...conv(level.player));

    for (let i = 0; i < level.AItanks.length; i++){
        AItanks.push(new TankEnemy(...conv(level.AItanks[i])));
    }
    for (let i = 0; i < level.walls.length; i++){
        walls.push(new Wall(...wallConv(level.walls[i])));
    }
}

function clearLevel() {
    AItanks = [];
    walls = [];
    tank = false;
}


function initLevel() {
    let margin = sizes.margin;
    let wallWidth = sizes.wallWidth;
    let doubleMargin = 2 * margin;
    let wallW2 = wallWidth        * 0.5;
    let mainW2 = mainCanvasWidth  * 0.5;
    let mainH2 = mainCanvasHeight * 0.5;

    //vertical
    walls.push( new Wall(
        margin + wallW2, mainH2 - wallW2,
        wallWidth, mainCanvasHeight - doubleMargin - wallWidth
    ));
    walls.push( new Wall(
        mainCanvasWidth - (margin + wallW2), mainH2 + wallW2,
        wallWidth, mainCanvasHeight - doubleMargin - wallWidth
    ));
    //horizontal
    walls.push( new Wall(
        mainW2 + wallW2 - wallWidth, mainCanvasHeight - margin - wallW2,
        mainCanvasWidth - doubleMargin - wallWidth, wallWidth
    ));
    walls.push( new Wall(
        mainW2 + wallW2, margin + wallW2,
        mainCanvasWidth - doubleMargin - wallWidth, wallWidth
    ));
}