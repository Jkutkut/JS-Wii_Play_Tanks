class WoodBox{
    constructor(x, y, w, h){
      this.pos = createVector(x, y);
      this.size = {w: w, h: h};
    }
    
    
    show(){
      push();
        fill(boxColor);
        rect(this.pos.x, this.pos.y, this.size.w, this.size.h);
      pop();
    }
  }