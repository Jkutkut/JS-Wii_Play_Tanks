// Variables to keep in mind: 
//  - mainCanvasWidth
//  - mainCanvasHeight


function loadLevelmk2(lvl) {

    let margin = mainCanvasHeight * 5 / 1080; // Adapt the size to be consistent with the window
    let wallWidth = margin * 3;
    let doubleMargin = 2 * margin;
    let wallW2 = wallWidth        * 0.5;
    let mainW2 = mainCanvasWidth  * 0.5;
    let mainH2 = mainCanvasHeight * 0.5;


    // Create the border walls
    [
        [
            margin + wallW2, mainH2 - wallW2,
            wallWidth, mainCanvasHeight - doubleMargin - wallWidth
        ],
        [
            mainCanvasWidth - (margin + wallW2), mainH2 + wallW2,
            wallWidth, mainCanvasHeight - doubleMargin - wallWidth
        ],
        [
            mainW2 + wallW2 - wallWidth, mainCanvasHeight - margin - wallW2,
            mainCanvasWidth - doubleMargin - wallWidth, wallWidth
        ],
        [
            mainW2 + wallW2, margin + wallW2,
            mainCanvasWidth - doubleMargin - wallWidth, wallWidth
        ]
    ].map(x => walls.push(new Wall(...x)));

    tank = new TankPlayer(200, 200);
}

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
        if (p[4]) {
            p[4] *= Math.PI;
        }
        return p;
    }

    // Load the level
    tank = new TankPlayer(...conv(level.player));

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


function changeLvl(lvl) {
    clearLevel();
    // loadLevel(lvl);
    loadLevelmk2(lvl);
}