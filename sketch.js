//tank
var tank;
var AItanks = [];

var objectProperties;
var COLORS = {};
var collisionHandler;

var bullets = []; //bullets, to keep track of them
var mines = []; //mines, to keep track of them
var walls = [];

//environment
var mainCanvasWidth;
var mainCanvasHeight;

var levelsJSON;


//debug
var debug = -1;
var fps = 30;
var enti;

function preload(){
    document.addEventListener('contextmenu', event => event.preventDefault());

    let commit = "6b239e570f3beed4b26d013693d781a99054c6cf";
    fetch("https://cdn.jsdelivr.net/gh/Jkutkut/JS-Wii_Play_tanks@" + commit + "/config.json")
    .then(response => response.json()).then(json => objectProperties = json);

    fetch("https://cdn.jsdelivr.net/gh/Jkutkut/JS-Wii_Play_tanks@" + commit + "/lib/levels.json")
    .then(response => response.json()).then(json => levelsJSON = json);

    boxTexture = loadImage("https://cdn.jsdelivr.net/gh/Jkutkut/JS-Wii_Play_Tanks@" + commit + "/Resources/wood-texture.jpg");
    backgroundTexture = loadImage("https://cdn.jsdelivr.net/gh/Jkutkut/JS-Wii_Play_Tanks@" + commit + "/Resources/light-wood-texture.jpg");
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
    for (let category in objectProperties.colors) {
        if (category.includes("rototype")) {
            // If the current category is a prototype, 
            // it only serves as info for the dev => skip
            continue;
        }
        COLORS[category] = {};

        console.log(objectProperties.colors[category])

        for (let ObjectColorObj of objectProperties.colors[category]) {
            COLORS[category][ObjectColorObj.id] = {};
            
            // console.log(objectProperties.colors[category + "Prototype"])
            // console.log(ObjectColorObj);
            for (let part of objectProperties.colors[category + "Prototype"]) {
                if (ObjectColorObj[part] == undefined) {
                    continue;
                }
                COLORS[category][ObjectColorObj.id][part] = color(...ObjectColorObj[part]);
            }
        }
    }


    // COLORS["tank"] = {};
    // for (let tankColorObj of objectProperties.colors.tank) {
    //     COLORS["tank"][tankColorObj.id] = {};
    //     for (let part of objectProperties.colors.tankPrototype) {
    //         COLORS["tank"][tankColorObj.id][part] = color(...tankColorObj[part]);
    //     }
    // }
    // COLORS["bullet"] = {};
    // for (let bulletColorObj of objectProperties.colors.bullet) {
    //     COLORS["bullet"][bulletColorObj.id] = {};
    //     for (let part of objectProperties.colors.bulletPrototype) {
    //         if (bulletColorObj[part] == undefined) {
    //             continue;
    //         }
    //         COLORS["bullet"][bulletColorObj.id][part] = color(...bulletColorObj[part]);
    //     }
    // }




    //box
    boxColor = color(227, 118, 34);

    loadLevel(1);

    collisionHandler = new CollisionHandler(tank, AItanks, walls, bullets);
}

function draw() {
    background(backgroundTexture);  

    // Bullets
    for(let i = 0; i < bullets.length; i++){
        bullets[i].move();
    }
    // Mines
    for (let i = 0; i < mines.length; i++) {
        mines[i].tick();
        if (mines[i].hasBeenDestroyed()) {
            mines.splice(i--, 1);
        }
    }
    tank.aim(mouseX, mouseY);
    
    keyD();

    collisionHandler.handleCollisions();


    // ++++ Drawing ++++
    // Walls
    for(let i = 0; i < walls.length; i++) {
        walls[i].show();
    }
    // Bullets
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].show();
    }
    // Mines
    for (let i = 0; i < mines.length; i++) {
        mines[i].show();
    }
    // AItanks
    for (let i = 0; i < AItanks.length; i++) {
        AItanks[i].behave();
        AItanks[i].show();
    }
    if (tank) {
        tank.show();
    }


    // User control
    if (mouseButton == "right") {
        tank.hability();
        mouseButton = "left";
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
    tank.shoot();
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