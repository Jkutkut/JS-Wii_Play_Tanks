class Tank{
  constructor(x, y, c){
    this.tankClass = (c != undefined)? c : 1;//number (index) -> 0 = player; else enemies
    this.pos = createVector(x, y, tankW);
    this.bodyD = createVector(1, 0);
    this.bodyAngle = 0;
    this.headAngle = 0;
  }
  
  show(){
    stroke(0);
    strokeWeight(2);

    let same = createVector(0, 0, 0);

    push();//tank
    translate(this.pos);

    //  ***  body  ***  //
    push();//body
    rotateZ(this.bodyAngle);//go to position
    this.shape("box", 
          same,
          createVector(tankW * 1.2, tankW, Math.round(tankW / 3)),
          tankC[this.tankClass].body);
    // -tires:
    for(let i = -1; i < 2; i += 2){
      this.shape("box",
          createVector(0, i * tankW / 2.5, 0),
          createVector(tankW * 1.25, tankW / 10, Math.round(tankW / 2.5)),
          tankC[0].tire);

      this.shape("box",
          createVector(0, i * (tankW / 2), 0),
          createVector(tankW * 1.1, tankW / 50, Math.round(tankW / 4)),
          tankC[0].tire);
    }
    pop();

    //  ***  head  ***
    push();//head
    rotateZ(this.headAngle);
    this.shape("box",
          createVector(0, 0, Math.round(tankW / 3)),
          createVector(tankW / 2, tankW / 2, tankW / 3.5),
          tankC[this.tankClass].gun);

    noStroke();

    push();//gun
    rotateZ(Math.PI / 2);
    this.shape("cylinder",
          createVector(0, -tankW / 2, Math.round(tankW / 3)),
          createVector(tankW / 16, tankW),
          tankC[this.tankClass].gun);

    this.shape("cylinder",
              createVector(0, -tankW, Math.round(tankW / 3)),
              createVector(tankW / 10, tankW / 8),
              tankC[this.tankClass].gunTip);
    pop();//end gun
    pop();//end head
    pop();//end tank
  }
  
  
  aim(mX, mY){//same as setHeadD but for player's tank
    let mouse = this.setHeadD(mX, mY);
    
    // mouse.y +=  ((height / 2) - mY) / 6;

    // console.log("(" + mX + ", " + mY + ")");
    
    push();
    translate(mouse);
    fill(0);
    sphere(2);
    
    pop();
    
  }
  
  setHeadD(mX, mY){
    //aim the head to the vector (mX, mY);
    let truePosi = this.pos.copy();
    truePosi.z = 0;
    if(!mX || !mY){//if not mX or mY given -> aim to the right
      let center = createVector(width / 2, height / 2, 0);
      mX = center.x + truePosi.x + 1;
      mY = center.y + truePosi.y;
    }
    let mouse = createVector(-width / 2, height / 2, 0).sub(createVector(-mX, mY, 0));    
    mouse.y += (mY > height / 2)? ((height / 2) - mY) / 4 : 0;
    let v = truePosi.sub(mouse);//vector from tank pos to mouse
    this.headAngle = (Math.atan(v.y / v.x) + ((v.x < 0)?  0 : Math.PI));
    
    
    mouse.y += (mY < height / 2)? Math.abs((height / 2) - mY) / 7 : (1 / 7 - (1 / 4)) * ((height / 2) - mY);//adjustment of perspective
    return mouse;
  }
  
  keyP(keyP){
    //rotate and move the tank
    let posi = createVector(0,0);
    switch(keyP){//key pressed?
      case 87://"w":
        posi.y = 1;
      break;
      case 83://"s":
        posi.y = -1;
      break;
      case 65://"a":
        posi.x = -1;
      break;
      case 68://"d":
        posi.x = 1;
      break;
    }
    if(posi.x != 0 || posi.y != 0){//if valid key pressed
      let alpha = this.bodyD.angleBetween(posi);
      let dir = this.bodyD.cross(posi).z;
      if(alpha > Math.PI / 20){
        alpha = (Math.PI / 20);
      }

      if(alpha < 0.03){
        let velo = p5.Vector.fromAngle(this.bodyAngle).mult(tankW * 0.2);
        this.pos.add(velo);
        //this.move();
      }
      else{
        this.bodyAngle += alpha * ((dir > 0)? 1: - 1);
        this.bodyD = createVector(Math.cos(this.bodyAngle), Math.sin(this.bodyAngle));
      }
      //console.log(alpha);
    }
  }
  
  shape(type, posi, dimensions, c){
    push();
    translate(posi);
    fill(c);
    switch(type){
      case "box":
        box(dimensions.x, dimensions.y, dimensions.z);
        break;
      case "cylinder":
        cylinder(dimensions.x, dimensions.y);
        break;
    }
    pop();
  }
  
  shoot(){
    let dir = p5.Vector.fromAngle(this.headAngle).mult(tankW);
    dir.z = tankW / 3;
    let bulletStart = this.pos.copy().add(dir);
    bullets.push(new Bullet(bulletStart, this.headAngle, 10));
  }
}

class tankEnemy extends Tank{
  constructor(x, y, c) {
    super(x, y, c);
  }
}