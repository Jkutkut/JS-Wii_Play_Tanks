class Tank{
    constructor(x, y, colorId = 0, sizeId = 0){
        this.pos = createVector(x, y);
        this.bodyD = createVector(1, 0);
        this.bodyAngle = 0;
        this.headAngle = 0;

        this.tankColor = tankC[colorId];
        this.tankSize = objectProperties[sizeId];
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
                        translate(0, i * this.tankSize.base.height / 2);
                        rect(...this.shape("box", this.tankSize.tires.small.len, this.tankSize.tires.small.width));
                        rect(...this.shape("box", this.tankSize.tires.big.len, this.tankSize.tires.big.width));
                    pop();
                }
            pop()

            //  ***  head  ***  //
            push()
                rotate(this.headAngle);
                fill(this.tankColor.gun);
                // head
                rect(...this.shape("box", this.tankSize.head.width));
                
                translate((this.tankSize.head.width + this.tankSize.head.gun.len) / 2, 0);
                // gun cylinder
                rect(...this.shape("box", this.tankSize.head.gun.len, this.tankSize.head.gun.width));
                
                translate(this.tankSize.head.gun.len * 0.5, 0);
                //tip
                rect(...this.shape("box", this.tankSize.head.gunTip.len, this.tankSize.head.gunTip.width));
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

    keyPress(keys){
        //rotate and move the tank
        let posi = createVector(0,0);
        for(let k in keys) {
            let keyP = keys[k];
        
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
                let alpha = this.bodyD.angleBetween(posi); //angle between when the body aims and the desired direction
                let dir = this.bodyD.cross(posi).z; // if the movement needed is clockwise or not
                
                if(alpha > Math.PI / 20) { // If the angle is really big
                    alpha = (Math.PI / 20); // on this iteration we will only rotate this amount max
                }

                if(alpha < 0.03){ // if angle small => ready to start moving
                    let deltaD = p5.Vector.fromAngle(this.bodyAngle).mult(this.tankSize.p.v);
                    this.pos.add(deltaD);
                }
                else { // If angle big, rotate the tank
                    this.bodyAngle += alpha * ((dir > 0)? 1: - 1);
                    this.bodyD = createVector(Math.cos(this.bodyAngle), Math.sin(this.bodyAngle));
                }
                //console.log(alpha);
            }
        }
    }

    shoot(){
        bullets.push(new Bullet(this));
    }
}

class tankEnemy extends Tank{
    constructor(x, y, c) {
        super(x, y, c);
    }
}