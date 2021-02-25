class Bullet{
    constructor(pos, angle, v, impact){
      this.pos = pos;
      this.angle = angle;
      this.v = v;
      impact = (impact != undefined)? impact : 1;
    }
    show(){
      // stroke(200, 200, 200);
      // strokeWeight(2);
      push();
      translate(this.pos);
      rotateZ(this.angle - Math.PI / 2);
      fill(tankC[0].bullet);
      cylinder(tankW / 16, tankW / 6);
      translate(createVector(0, tankW / 12 + tankW / 32, 0));
      cone(tankW / 16, tankW / 16);
      pop();
    }
    
    move(){
      let dir = p5.Vector.fromAngle(this.angle).mult(tankW / 10);
      this.pos.add(dir);
    }
    
    validSpot(){
      return Math.abs(this.pos.x) < width / 2 && Math.abs(this.pos.y) < height / 2;
    }
  }