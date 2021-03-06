//tank
var tank;
var AItanks = [];

var objectProperties;
var tankC;

var bullets = []; //bullets, to keep track of them
var walls = [];

//environment
var mainCanvasWidth;
var mainCanvasHeight;

var lastBMilli = 0;
var shotDelay = 10;


//debug
var debug = -1;
var enti;

function preload(){
    let commit = "5341973efdfe66dee85adbe8439c11acd09cbb1a";
    fetch("https://cdn.jsdelivr.net/gh/Jkutkut/JS-Wii_Play_tanks@" + commit + "/tankProperties.json")
    .then(response => response.json()).then(json => objectProperties = json);
    boxTexture = loadImage("https://cdn.jsdelivr.net/gh/Jkutkut/JS-Wii_Play_Tanks@" + commit + "/textures/wood-texture.jpg");
    backgroundTexture = loadImage("https://cdn.jsdelivr.net/gh/Jkutkut/JS-Wii_Play_Tanks@" + commit + "/textures/light-wood-texture.jpg");
}


function setup() {
    mainCanvasWidth = (mainCanvasWidth)? mainCanvasWidth : windowWidth;
    mainCanvasHeight = (mainCanvasHeight)? mainCanvasHeight : mainCanvasWidth * 9 / 16;

    createCanvas(mainCanvasWidth, mainCanvasHeight);
    noCursor();
    frameRate(30);
    textSize(20);

    // *******  var setup  *******
    //tank
    tankC = [
        {
            body: color(54, 137, 200),
            gun: color(47, 92, 120),
            gunTip: color(29, 66, 89),
            tire: color(36, 36, 36),
            bullet: color(255, 255, 255)
        },{
            body: color(141, 108, 59),
            gun: color(137, 107, 52),
            gunTip: color(115, 89, 42),
            tire: color(36, 36, 36),
            bullet: color(255, 255, 255)
        }
    ];

    tank = new Tank(mainCanvasWidth / 2, mainCanvasHeight / 2, 0);  
    AItanks.push(new Tank(200, 200, 1, 0));



    //box
    boxColor = color(227, 118, 34);

    let margin = 5;
    let wallWidth = 15;

    // Vertical
    walls.push(new WoodBox(
        margin, margin,
        wallWidth, mainCanvasHeight - 2 * margin - wallWidth));
    
    walls.push(new WoodBox(
        mainCanvasWidth - 4 * margin, margin + wallWidth,
        wallWidth, mainCanvasHeight - 2 * margin - wallWidth));

    //horizontal
    walls.push(new WoodBox(
        margin + wallWidth, margin,
        mainCanvasWidth - margin * 2 - wallWidth, wallWidth));
    walls.push(new WoodBox(
            margin, mainCanvasHeight - (margin + wallWidth),
            mainCanvasWidth - wallWidth - 2 * margin, wallWidth));


}

function draw() {
    background(backgroundTexture);

    for(let i = 0; i < walls.length; i++) {
        walls[i].show();
    }

    for(let i = 0; i < bullets.length; i++){
      bullets[i].move();
      if(!bullets[i].validSpot()){
        // bullets[i].pos = createVector(0, 0, tankW);
        bullets.splice(i, 1);
        i--;
        continue;
      }
      bullets[i].show();
    }

    for (let i = 0; i < AItanks.length; i++) {
        AItanks[i].show();
    }

    tank.aim(mouseX, mouseY);
    keyD();
    tank.show();

    

    if(debug == 0){
        noLoop();
    }

    push()
        translate(20, 20)
        text(Math.round(frameRate()), 0, 0);
    pop()
}

function mouseClicked() {
    if(millis() - lastBMilli > shotDelay){
    tank.shoot();
    // console.log("new bullet: " + bullets.length);
    lastBMilli = millis();
    }
}

function keyD(){
    let k = false;

    switch (true) {
        case keyIsDown(87):
            k = 87;
            break;
        case keyIsDown(83):
            k = 83;
            break;
        case keyIsDown(65):
            k = 65;
            break;
        case keyIsDown(68):
            k = 68;
            break;
    }
    if (k) {
        tank.keyP(k);
    }
}
function keyPressed() {
    //console.log(keyCode);
    tank.keyP(keyCode);
}