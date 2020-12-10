//tank
var tank;
var tankW = 40;
var tankC;
var shotDelay = 200;
var lastBMilli = 0;
var bullets = [];//bullets, to keep track of them


//environment
var angle = Math.PI * 3 / 18;
let groundLength = 900;//width of the plane, width of the surface
let groundHeight = groundLength * 9 / (16 * Math.cos(angle));

let backgroundTexture;
var boxColor;
var boxTexture;
var boxW = 40;
var boxH = 60;
var border = [];

//debug
var debug = -1;
var enti;

/*
Things to do:
-fix error of perspective
-Reticle
-Colisions
-Obstacles
-Border
-levels
-interface (lives)
-menu
-AI

*/


function preload(){
  boxTexture = loadImage("https://raw.githubusercontent.com/Jkutkut/JS-Wii_Play_Tanks/tree/master/textures/wood-texture.jpg");
  backgroundTexture = loadImage("https://raw.githubusercontent.com/Jkutkut/JS-Wii_Play_Tanks/tree/master/textures/light-wood-texture.jpg");
}

function setup() {
  createCanvas(groundLength, groundLength * 9 / 16, WEBGL);
  // frameRate(1);
  frameRate(30);
  // ortho(-width / 2, width / 2, height / 2, -height / 2, 0, width);
  ortho(-width / 2, width / 2, height / 2, -height / 2);
  
  // noCursor();
  
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
    //
  ];
  
  
  //box
  boxColor = color(255, 204, 0);
  
  
  
  
  /*for(let i = 0; i > -groundHeight; i -= groundHeight / 2){
    border.push(new woodBox((boxW - groundLength) / 2 , i - groundHeight / 4, boxW, groundHeight / 2));
    border.push(new woodBox((boxW - groundLength) / 2 , (groundHeight / 4) - i, boxW, groundHeight / 2));
  }*/
  
  
  tank = new Tank(0, 0, 0);  
}

function draw() {
  background(255);
  rotateX(-angle);
  
  
  keyD();
    
  for(let i = 0; i < bullets.length; i++){
    bullets[i].move();
    if(!bullets[i].validSpot()){
      bullets[i].pos = createVector(0, 0, tankW);
    }
    bullets[i].show();
  }
  
  tank.aim(mouseX, mouseY);
  tank.show();
  
  
  /*for(let i = 0; i < border.length; i++){
    border[i].show();  
  }*/
  
  stroke(0);
  strokeWeight(2);
  texture(backgroundTexture);
  noStroke();
  plane(groundLength - 2, groundHeight - 2);
  
  
  if(debug-- == 0){
    noLoop();
  }
}

function mouseClicked() {
  if(millis() - lastBMilli > shotDelay){
    tank.shoot();
    // console.log("new bullet: " + bullets.length);
    lastBMilli = millis();
  }
}
function keyD(){
  let k = 0;
  if(keyIsDown(87)){//83 65 68
    tank.keyP(87);
  }
  if(keyIsDown(83)){
    tank.keyP(83);
  }
  if(keyIsDown(65)){
    tank.keyP(65);

  }
  if(keyIsDown(68)){
    tank.keyP(68);
  }
}
function keyPressed() {
  //console.log(keyCode);
  tank.keyP(keyCode);
}