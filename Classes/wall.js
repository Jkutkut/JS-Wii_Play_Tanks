class woodBox{
    constructor(x, y, w, h){
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }
    
    
    show(){
      translate(x, y, boxW);
      //push();
      stroke(0);
      strokeWeight(2);
      
      texture(boxTexture);
      
      
      // box(tankW, tankW * 3, Math.round(tankW / 3));
      box(this.w, this.h, boxW);
      
      //pop();
      
      translate(-x, -y, -boxW);
    }
  }