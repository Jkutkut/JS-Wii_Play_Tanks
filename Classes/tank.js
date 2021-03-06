class Tank{
    constructor(x, y, colorId = 0, sizeId = 0){
        this.pos = createVector(x, y);
        this.bodyD = createVector(1, 0);
        this.bodyAngle = 0;
        this.headAngle = 0;

        this.tankColor = tankC[colorId];
        this.tankSize = tankSize[sizeId];
    }

    show(){
        stroke(0); //black border
        strokeWeight(2); // border size

        push();
            translate(this.pos);

            //  ***  body  ***  //
            push()
                rotate(this.bodyAngle);

                fill(this.tankColor.body);
                rect(...this.shape("box", this.tankSize.base.width, this.tankSize.base.height))

                //  ***  tires  ***  //
                fill(this.tankColor.tire);
                for (let i = -1; i < 2; i += 2) {
                    push();
                        translate(0, i * 30);
                        rect(...this.shape("box", 80, 10));
                        rect(...this.shape("box", 82, 5));
                    pop();
                }
            pop()

            //  ***  head  ***  //
            push()
                rotate(this.headAngle);
                fill(this.tankColor.gun);
                rect(...this.shape("box", 40));
                translate(40, 0);
                rect(...this.shape("box", 40, 10));
                translate(20, 0)
                rect(...this.shape("box", 8, 15));
            pop()
        pop();
    }

    shape(type, w, h) {
        switch(type) {
            case "box":
                let wSize = (w / 2);
                let hSize;

                if (!h) {
                    hSize = wSize;
                    h = w;
                }
                else {
                    hSize = (h / 2);
                }
                // return [0, 0, wSize, hSize];
                return [- wSize, - hSize, w, h];
        }
    }




    aim(mX, mY){ //same as setHeadD but for player's tank
        let mouse = createVector(mX, mY);
        let headDirection = this.pos.copy().sub(mouse); // vector from tank pos to mouse
        this.headAngle = (Math.atan(headDirection.y / headDirection.x) + ((headDirection.x < 0)?  0 : Math.PI));

        push();
            translate(mouse);
            fill(0);
            ellipse(0, 0, 4, 4);
            for (let i = 0; i < 4; i++) {
                push()
                    rotate(Math.PI / 2 * i)
                    translate(10, 0)
                    rect(...this.shape("box", 5, 2))
                pop()
            }
        pop();
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
                let velo = p5.Vector.fromAngle(this.bodyAngle).mult(this.tankSize.p.v * 0.2);
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
    let dir = p5.Vector.fromAngle(this.headAngle).mult(this.tankSize.p.v);
    dir.z = this.tankSize.p.v / 3;
    let bulletStart = this.pos.copy().add(dir);
    bullets.push(new Bullet(bulletStart, this.headAngle, 10));
    }
}

class tankEnemy extends Tank{
    constructor(x, y, c) {
        super(x, y, c);
    }
}