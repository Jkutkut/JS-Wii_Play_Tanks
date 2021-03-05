//tank
var tank;
var tankW = 40;
var tankC;
const shotDelay = 200;
var lastBMilli = 0;
var bullets = []; //bullets, to keep track of them


//environment
var mainCanvasWidth;
var mainCanvasHeight;

var border = [];


//debug
var debug = -1;
var enti;

function preload(){
    boxTexture = loadImage("https://cdn.jsdelivr.net/gh/Jkutkut/JS-Wii_Play_Tanks@master/textures/wood-texture.jpg");
    backgroundTexture = loadImage("https://cdn.jsdelivr.net/gh/Jkutkut/JS-Wii_Play_Tanks@master/textures/light-wood-texture.jpg");
}


function setup() {
    mainCanvasWidth = (mainCanvasWidth)? mainCanvasWidth : windowWidth;
    mainCanvasHeight = (mainCanvasHeight)? mainCanvasHeight : mainCanvasWidth * 9 / 16;

    createCanvas(mainCanvasWidth, mainCanvasHeight);
    noCursor();
    frameRate(30);

    // noCursor();
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
        }
    ];


    //box
    boxColor = color(255, 204, 0);

    tank = new Tank(mainCanvasWidth / 2, mainCanvasHeight / 2, 0);  
}

function draw() {
    background(backgroundTexture);

    // for(let i = 0; i < bullets.length; i++){
    //   bullets[i].move();
    //   if(!bullets[i].validSpot()){
    //     bullets[i].pos = createVector(0, 0, tankW);
    //   }
    //   bullets[i].show();
    // }

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