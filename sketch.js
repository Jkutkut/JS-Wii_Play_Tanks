//tank
var tank;
var AItanks = [];

var objectProperties;
var tankC;
var collisionHandler;

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
    mainCanvasWidth = windowWidth;
    mainCanvasHeight = windowWidth * 9 / 16;
    
    if (mainCanvasHeight > windowHeight) {
        mainCanvasWidth = windowHeight * 16 / 9;
        mainCanvasHeight = windowHeight;
    }

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

    tank = new Tank(100, mainCanvasHeight / 2, 0);  
    for (let i = 0; i < 8; i++){
        AItanks.push(new Tank(mainCanvasWidth * 0.8, 90 * (i + 1), 1, 0));
    }



    //box
    boxColor = color(227, 118, 34);

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

    collisionHandler = new CollisionHandler(tank, walls);
}

function draw() {
    background(backgroundTexture);

    // Draw walls
    for(let i = 0; i < walls.length; i++) {
        walls[i].show();
    }

    // Bullets
    for(let i = 0; i < bullets.length; i++){
      bullets[i].move();
      if(!bullets[i].validSpot()){
        bullets.splice(i--, 1);
        continue;
      }
      else {
            collisionHandler.collidingBulletWall(bullets[i]);
            
            if (bullets[i].bounces == 0) { // If no remaing bounces
                bullets.splice(i--, 1);
                continue
            }
      }
    }
    collisionHandler.bulletAniquilation(bullets);
    collisionHandler.tankAniquilation(AItanks, bullets);

    for (let i = 0; i < bullets.length; i++) {
        bullets[i].show();
    }


    // AItanks
    for (let i = 0; i < AItanks.length; i++) {
        AItanks[i].show();
    }

    tank.aim(mouseX, mouseY);
    keyD();
    tank.show();

    
    // Debug
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
    let keys = [];

    if (keyIsDown(87)) {
        keys.push(87);
    }
    if (keyIsDown(83)) {
        keys.push(83);
    }
    if (keyIsDown(65)) {
        keys.push(65);
    }
    if (keyIsDown(68)) {
        keys.push(68);
    }


    if (keys.length != 0) {
        tank.keyPress(keys);
    }
}
function keyPressed() {
    //console.log(keyCode);
    tank.keyPress([keyCode]);
}