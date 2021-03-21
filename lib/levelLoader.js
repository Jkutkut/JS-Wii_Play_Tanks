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


    // levelsJSON

    let levelWidth = mainCanvasWidth - (margin + wallWidth) * 2;
    let levelHeight = mainCanvasHeight - (margin + wallWidth) * 2;

    let cubeSize = {
        x: levelWidth / levelsJSON.properties.grid.w,
        y: levelHeight / levelsJSON.properties.grid.h
    };
    
    let indexPos2pixelPos = (i, j) => {
        let start = margin + wallWidth;
        return [start + i * cubeSize.x, start + j * cubeSize.y]
    };

    let data2indexPos = function(pos) {
        let result = [0, 0];
        if (typeof pos.x == "number") {
            result[0] = pos.x;
        }
        else if (pos.x == "CENTER"){
            result[0] = levelsJSON.properties.grid.w / 2 - 1;
        }

        if (typeof pos.y == "number") {
            result[1] = pos.y;
        }
        else if (pos.y == "CENTER"){
            result[1] = levelsJSON.properties.grid.h / 2 - 1;
        }
        return result;
    }

    let getPos = (pos) => {return indexPos2pixelPos(...data2indexPos(pos))};

    let level = levelsJSON.levels[lvl];


    for (let i = 0; i < levelsJSON.properties.grid.w; i++) {
        for (let j = 0; j < levelsJSON.properties.grid.h; j++) {
            walls.push(new WallByIndex(...indexPos2pixelPos(i, j), cubeSize.x, cubeSize.y));
        }
    }
    
    for (let wall of level.environment.walls) {
        let wSize = [
            wall.w * cubeSize.x,
            wall.h * cubeSize.y
        ];
        walls.push(new Wall(...getPos(wall), ...wSize));
    }
    

    // tanks

    tank = new TankPlayer(...getPos(level.player));


    let enemyTanksConv = {
        "brown_tank": TankEnemy
    };

    for(let enemyTank of level.tanks) {
        AItanks.push(new enemyTanksConv[enemyTank.type](...getPos(enemyTank.pos)));
    }
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