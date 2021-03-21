/**
 * Loads the selected level
 * @param {int} lvl Desired level to load (1 based)
 */
function loadLevel(lvl) {
    // Constants to use for the borderWalls
    let margin = mainCanvasHeight * 5 / 1080; // Adapt the size to be consistent with the window
    let wallWidth = margin * 3; // width of the wall
    let doubleMargin = 2 * margin;
    // Halfs
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


    // Generate the level using levelsJSON

    // Space available for the level itself 
    let levelWidth = mainCanvasWidth - (margin + wallWidth) * 2;
    let levelHeight = mainCanvasHeight - (margin + wallWidth) * 2;

    let squareSize = { // Size of the oficial "squares" used on the json level logic
        w: levelWidth / levelsJSON.properties.grid.w,
        h: levelHeight / levelsJSON.properties.grid.h
    };
    
    /**
     * Converts the index position given on the pixel equivalent
     * @param {int} i horizontal index position (0 based)
     * @param {int} j vertical index position (0 based)
     * @returns pixel equivalent as an array
     */
    let indexPos2pixelPos = (i, j) => {
        let start = margin + wallWidth;
        return [start + i * squareSize.w, start + j * squareSize.h]
    };

    /**
     * Transforms the position given in the json to the correct index.
     * If int given, output is the same.
     * If special string is given, the equivalent is calculated.
     * @param {json} pos position given by the json file (int or special strings)
     * @returns index equivalent of the data given
     */
    let data2indexPos = function(pos) {
        let result = [0, 0];
        if (typeof pos.x == "number") {
            result[0] = pos.x;
        }
        else if (pos.x == "CENTER"){
            result[0] = levelsJSON.properties.grid.w / 2;
        }

        if (typeof pos.y == "number") {
            result[1] = pos.y;
        }
        else if (pos.y == "CENTER"){
            result[1] = levelsJSON.properties.grid.h / 2;
        }
        return result;
    }

    /**
     * Transforms the json position of the desired object to a pixel vector in a array format
     * @param {json} pos json position objet of the desired object
     * @returns Equivalent in pixels of the position
     */
    let getPos = (pos) => {return indexPos2pixelPos(...data2indexPos(pos))};

    let level = levelsJSON.levels[lvl]; // Here is the JSON we really need for the desired level


    // Create the walls

    // for (let i = 0; i < levelsJSON.properties.grid.w; i++) {
    //     for (let j = 0; j < levelsJSON.properties.grid.h; j++) {
    //         walls.push(new WallByIndex(...indexPos2pixelPos(i, j), squareSize.w, squareSize.h));
    //     }
    // }
    
    for (let wall of level.environment.walls) { // For each desired wall
        let wSize = [ // Dimensions of the wall
            wall.w * squareSize.w,
            wall.h * squareSize.h
        ];
        if (typeof wall.x != "number" || typeof wall.y != "number") { // If the wall has a special string as pos
            walls.push(new Wall(...getPos(wall), ...wSize)); // Use the class based on the center.
        }
        else {
            walls.push(new WallByIndex(...getPos(wall), ...wSize)); // Use the class based on the corner
        }
    }
    

    // Create the tanks

    /**
     * Move the tank half a square (only if no special string has been used).
     * @param {Tank} tank tank to move
     * @param {json} pos deltaVector to move
     */
    let adjustTankP = (tank, pos) => {
        let extra = createVector(
            (typeof pos.x == "number")? 0.5 * squareSize.w: 0,
            (typeof pos.y == "number")? 0.5 * squareSize.h: 0
        );
        tank.tpRelative(extra);
    };

    tank = new TankPlayer(... getPos(level.player)); // Create the players tank
    adjustTankP(tank, level.player); // Adjust the position if needed
    

    let enemyTanksConv = { // This will allow to use the correct type of enemyTank based on the JSON
        "brown_tank": TankEnemy
    };

    let enemy;
    for(let enemyTank of level.tanks) { // for each enemyTank
        enemy = new enemyTanksConv[enemyTank.type](...getPos(enemyTank.pos)); // Create the enemy tank
        AItanks.push(enemy); // Add it to the stack
        adjustTankP(enemy, enemyTank.pos); // Adjust the position if needed
    }
}

/**
 * Clears the level of all the objects
 */
function clearLevel() {
    AItanks = [];
    walls = [];
    tank = null;
    bullets = [];
}

/**
 * Changes the level to the desired one. If the same selected, the level is reseted
 * @param {int} lvl Level to change to (1 based)
 */
function changeLvl(lvl) {
    clearLevel();
    loadLevel(lvl);
}