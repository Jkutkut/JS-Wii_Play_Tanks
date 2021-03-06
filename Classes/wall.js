class WoodBox{
    constructor(x, y, w, h){
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }
    
    
    show(){
      push();
        // stroke(0);
        // strokeWeight(2);
        fill(boxColor);

        // translate(this.x, this.y);
        rect(this.x, this.y, this.w, this.h);
      pop();
    }
  }