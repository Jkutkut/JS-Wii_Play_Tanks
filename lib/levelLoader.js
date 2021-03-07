// Variables to keep in mind: 
//  - mainCanvasWidth
//  - mainCanvasHeight


var levels = [
    {
        player: {
            pos: {

            }
        },
        // constructor (x, y, w, h, angle=0)
        walls: [
            []
        ],
        AItanks: [
            []
        ]
    }
];

function loadLevel(lvl) {

}

function clearLevel(clearPlayer=false) {
    AItanks = [];
    if (clearPlayer) {
        tank = null;
    }
    walls = [];
}


function initLevel() {
    let margin = 5;
    let wallWidth = 15;
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