//tank
var tank;
var AItanks = [];

var objectProperties;
var COLORS = {};
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
var fps = 30;
var enti;

function preload(){
    let commit = "3b8a23f23b8be6e4636012762a07bcab0ede5951";
    fetch("https://cdn.jsdelivr.net/gh/Jkutkut/JS-Wii_Play_tanks@" + commit + "/config.json")
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
    frameRate(fps);
    // frameRate(30);
    textSize(20);

    // *******  var setup  *******
    // Update COLORS variable (see config.json to undestand the format)
    COLORS["tank"] = {};
    for (let tankColorObj of objectProperties.colors.tank) {
        COLORS["tank"][tankColorObj.id] = {};
        for (let part of objectProperties.colors.tankPrototype) {
            COLORS["tank"][tankColorObj.id][part] = color(...tankColorObj[part]);
        }
    }
    COLORS["bullet"] = {};
    for (let bulletColorObj of objectProperties.colors.bullet) {
        COLORS["bullet"][bulletColorObj.id] = {};
        for (let part of objectProperties.colors.bulletPrototype) {
            if (bulletColorObj[part] == null) {
                continue;
            }
            COLORS["bullet"][bulletColorObj.id][part] = color(...bulletColorObj[part]);
        }
    }




    //box
    boxColor = color(227, 118, 34);

    initLevel();
    loadLevel(1);

    collisionHandler = new CollisionHandler(tank, AItanks, walls, bullets);
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
    }
    tank.aim(mouseX, mouseY);
    
    keyD();

    collisionHandler.handleCollisions();


    // ++++ Drawing ++++
    // Bullets
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].show();
    }
    // AItanks
    for (let i = 0; i < AItanks.length; i++) {
        AItanks[i].behave();
        AItanks[i].show();
    }
    if (tank) {
        tank.show();
    }

    // Mouse cursor:
    let mouse = createVector(mouseX, mouseY);
    push();
        translate(mouse);
        fill(0);
        ellipse(0, 0, 4, 4);
        for (let i = 0; i < 4; i++) {
            push()
                rotate(Math.PI / 2 * i)
                translate(10, 0)
                rect(...shape("box", 5, 2))
            pop()
        }
    pop();

    
    // Debug
    if(debug == 0){
        noLoop();
    }

    push()
        translate(40, 50)
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