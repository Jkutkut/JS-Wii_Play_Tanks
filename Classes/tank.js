class Tank{
    constructor(x, y, colorId = 0, sizeId = 0){
        this.pos = createVector(x, y);
        this.bodyD = createVector(1, 0);
        this.bodyAngle = 0;
        this.headAngle = 0;

        this.tankColor = tankC[colorId];
        this.tankSize = objectProperties[sizeId];

        this.size = {
            w: this.tankSize.base.width,
            h: this.tankSize.base.height + this.tankSize.tires.small.width
        };
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
                rect(...shape("box", this.tankSize.base.width, this.tankSize.base.height))

                //  ***  tires  ***  //
                fill(this.tankColor.tire);
                for (let i = -1; i < 2; i += 2) {
                    push();
                        translate(0, i * this.tankSize.base.height / 2);
                        rect(...shape("box", this.tankSize.tires.small.len, this.tankSize.tires.small.width));
                        rect(...shape("box", this.tankSize.tires.big.len, this.tankSize.tires.big.width));
                    pop();
                }
            pop()

            //  ***  head  ***  //
            push()
                rotate(this.headAngle);
                fill(this.tankColor.gun);
                // head
                rect(...shape("box", this.tankSize.head.width));
                
                translate((this.tankSize.head.width + this.tankSize.head.gun.len) / 2, 0);
                // gun cylinder
                rect(...shape("box", this.tankSize.head.gun.len, this.tankSize.head.gun.width));
                
                translate(this.tankSize.head.gun.len * 0.5, 0);
                //tip
                rect(...shape("box", this.tankSize.head.gunTip.len, this.tankSize.head.gunTip.width));
            pop()
        pop();
    }

    getSATdata() {
        let size2 = {
            w: this.size.w / 2,
            h: this.size.h / 2
        }
        let obj = new SAT.Polygon(
            new SAT.Vector(this.pos.x, this.pos.y),
            [
                new SAT.Vector(-size2.w, -size2.h),
                new SAT.Vector(-size2.w, size2.h),
                new SAT.Vector(size2.w, size2.h),
                new SAT.Vector(size2.w, -size2.h),
            ]
        );
        obj.rotate(this.bodyAngle);
        return obj;
    }

    aim(mX, mY){
        let mouse = createVector(mX, mY);
        let headDirection = this.pos.copy().sub(mouse); // vector from tank pos to mouse
        this.headAngle = (Math.atan(headDirection.y / headDirection.x) + ((headDirection.x < 0)?  0 : Math.PI));
    }

    advance(deltaD) {
        this.pos.add(deltaD);
        if (collisionHandler.canGoHere(this) != true) {
            deltaD.mult(-1);
            this.pos.add(deltaD);
        }
    }

    shoot(){
        bullets.push(new Bullet(this));
    }
}

class TankPlayer extends Tank {
    constructor (x, y, colorId = 0, sizeId = 0) {
        super(x, y, colorId, sizeId);
    }

    keyPress(keys){
        //rotate and move the tank
        
        let desiredPosi = {x: 0, y: 0};
        for(let i = 0; i < keys.length; i++) {
            switch(keys[i]) {
                case 87://"w":
                    desiredPosi.y += 1; // should be -, but works
                    continue;
                case 83://"s":
                    desiredPosi.y -= 1; // should be +, but works
                    continue;
                case 65://"a":
                    desiredPosi.x -= 1;
                    continue;
                case 68://"d":
                    desiredPosi.x += 1;
                    continue;
            }
        }
        let desiredAngle = null; // (radians)

        if(desiredPosi.x != 0) { // If horizontal movement
            if (desiredPosi.y == 0) { // if no vertical movement
                desiredAngle = (desiredPosi.x == 1)? 0 : 1;
            }
            else if (desiredPosi.x == -1) { // if a and vertical key pressed
                desiredAngle = 1 + ((desiredPosi.y == 1)? 0.25 : -0.25);
            }
            else {
                if (desiredPosi.y == 1) { // if d and s
                    desiredAngle = 1.75;
                }
                else { // if d and w
                    desiredAngle = 0.25;
                }
            }
        }
        else { // No horizontal movement
            if (desiredPosi.y == 1) { // s => down
                desiredAngle = 1.5;
            }
            else if (desiredPosi.y == -1) { // w => up
                desiredAngle = 0.5;
            }
        }

        if(desiredAngle != null){//if valid key pressed
            desiredAngle *= Math.PI; // Now this is true radians
            
            let alpha = desiredAngle - this.bodyAngle; //angle between when the body aims and the desired direction

            let dir = 1; // if the movement needed is clockwise or not
            if (alpha < 0) {
                dir = -1;
                alpha *= -1;
            }

            if (alpha >= Math.PI * 0.5) { // If we want to rotate more than half a turn
                alpha = (alpha + Math.PI) % (Math.PI * 2); // Equivalent to ((alpha - π) + 2π) % 2π
                this.bodyAngle = (this.bodyAngle + Math.PI) % (2 * Math.PI);
                dir *= -1;
            }


            if(alpha > Math.PI / 20) { // If the angle is really big
                alpha = (Math.PI / 20); // on this iteration we will only rotate this amount max
            }

            if(alpha < 0.03){ // if angle small => ready to start moving
                let deltaD = p5.Vector.fromAngle(this.bodyAngle).mult(this.tankSize.p.v * dir);
                this.advance(deltaD);
            }
            else { // If angle big, rotate the tank
                this.bodyAngle += alpha * ((dir > 0)? 1: - 1);
                if (this.bodyAngle < 0) {
                    this.bodyAngle *= 2 * PI; // Always keep it positive
                }
                this.bodyD = createVector(Math.cos(this.bodyAngle), Math.sin(this.bodyAngle));
            }
        }
    }
}

class TankEnemy extends Tank{
    constructor(x, y, colorId = 1, sizeId = 0) {
        super(x, y, colorId, sizeId);
        
        this.playerFound = false;
    }
}