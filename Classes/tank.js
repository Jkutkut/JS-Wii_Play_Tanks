class Tank{
    constructor(x, y, c){
        this.pos = createVector(x, y);
        this.bodyD = createVector(1, 0);
        this.bodyAngle = 0;
        this.headAngle = 0;

        this.tankColor = tankC[c];
    }

    show(){
        stroke(0); //black border
        strokeWeight(2); // border size

        push();//tank
        translate(this.pos);

        //  ***  body  ***  //

        fill(this.tankColor.body);
        rotate(this.bodyAngle);

        rect(...this.shape("box", 80, 60))
        pop();
    }

    shape(type, w, h) {
        switch(type) {
            case "box":
                let wSize = (w / 2);
                let hSize;

                if (!h) {
                    hSize = wSize;
                }
                else {
                    hSize = (h / 2);
                }
                // return [0, 0, wSize, hSize];
                return [- wSize, - hSize, w, h];
        }
    }




    aim(mX, mY){//same as setHeadD but for player's tank
    let mouse = this.setHeadD(mX, mY);

    // mouse.y +=  ((height / 2) - mY) / 6;

    // console.log("(" + mX + ", " + mY + ")");

    // push();
    // translate(mouse);
    // fill(0);
    // ellipse(2);

    // pop();

    }

    setHeadD(mX, mY){
    //aim the head to the vector (mX, mY);
    let truePosi = this.pos.copy();
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
                posi.y = -1;
                break;
            case 83://"s":
                posi.y = 1;
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