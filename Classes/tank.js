class Tank{
    constructor(x, y, sizeId = 0){
        this.pos = createVector(x, y);
        this.bodyD = createVector(1, 0);
        this.bodyAngle = 0;
        this.headAngle = 0;

        
        this.tankSize = objectProperties.tank.dimensions;

        this.shootDelay = 30;
        this.shootCooldown = 0;

        this.size = {
            w: this.tankSize.base.width,
            h: this.tankSize.base.height + this.tankSize.tires.small.width
        };
    }

    show(){
        this.shootCooldown--;

        stroke(0); //black border
        strokeWeight(2); // border size

        push();
            translate(this.pos);
            fill(this.tankColor.body);

            //  ***  body  ***  //
            push()
                rotate(this.bodyAngle);
                rect(...shape("box", this.tankSize.base.width, this.tankSize.base.height))

                //  ***  tires  ***  //
                for (let i = -1; i < 2; i += 2) {
                    push();
                        translate(0, i * this.tankSize.base.height / 2);
                        fill(this.tankColor.tireInner);
                        rect(...shape("box", this.tankSize.tires.small.len, this.tankSize.tires.small.width));
                        fill(this.tankColor.tireOuter);
                        rect(...shape("box", this.tankSize.tires.big.len, this.tankSize.tires.big.width));
                    pop();
                }
            pop()

            //  ***  head  ***  //
            push()
                rotate(this.headAngle);
                // head
                // fill(this.tankColor.body);
                rect(...shape("box", this.tankSize.head.width));
                
                translate((this.tankSize.head.width + this.tankSize.head.gun.len) / 2, 0);
                // gun cylinder
                fill(this.tankColor.gun);
                rect(...shape("box", this.tankSize.head.gun.len, this.tankSize.head.gun.width));
                
                translate(this.tankSize.head.gun.len * 0.5, 0);
                //tip
                fill(this.tankColor.gunTip);
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
        if (this.shootCooldown < 0) {
            bullets.push(new Bullet(this));
            this.shootCooldown = this.shootDelay;
        }
    }
}

class TankPlayer extends Tank {
    constructor (x, y, colorId = 0, sizeId = 0) {
        super(x, y, colorId, sizeId);
        this.tankColor = COLORS.tank.player;
        this.properties = objectProperties.tank.player;
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
                let deltaD = p5.Vector.fromAngle(this.bodyAngle).mult(this.properties.v * dir);
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

        this.tankColor = COLORS.tank.brown_tank;
        this.properties = objectProperties.tank.enemy[0];


        this.headAngle = Math.PI;
        
        this.playerFound = false;
        this.playerLastPos = createVector(0, 0);
    
        this.rays = [];
        this.rayAperture = 45; //Degrees
        for (let a = -this.rayAperture; a < this.rayAperture; a++) {
            this.rays.push(new Ray(this.pos, radians(a) + this.headAngle));
        }
    }

    look(tank, wallsToCheck) {
        this.playerFound = false;

        let elements = [tank];
        for (let i = 4; i < wallsToCheck.length; i++){
            elements.push(wallsToCheck[i]);
        }

        for (let i = 0; i < this.rays.length; i++) {
            const ray = this.rays[i];
            let closest = null;
            let record = Infinity;
            let index = null;
            for (let j = 0; j < elements.length; j++) {
                const pt = ray.cast(elements[j]);
                if (pt) { // if intersection found
                    const d = p5.Vector.dist(this.pos, pt);
                    if (d < record) {
                        record = d;
                        closest = pt.copy();
                        index = j;
                    }
                }
            }
            if (closest != null) { // If this ray has found something
                if (elements[index] instanceof TankPlayer) { // if player found
                    push();
                    stroke(0, 0, 0, 30);
                    line(this.pos.x, this.pos.y, closest.x, closest.y);
                    pop();
                    this.playerFound = true;
                    this.playerLastPos = elements[index].pos;
                    this.aim(this.playerLastPos.x, this.playerLastPos.y)
                }
                else {
                    push();
                    stroke(220, 30, 10, 100);
                    line(this.pos.x, this.pos.y, closest.x, closest.y);
                    pop();
                }
            }
        }
    }

    aim(mX, mY) {
        Tank.prototype.aim.call(this, mX, mY);
        for(let i = 0; i < this.rayAperture * 2; i++){
            this.rays[i].lookAt(mX, mY);
            this.rays[i].rotateDeg(i - this.rayAperture);
        }
    }

    show() {
        Tank.prototype.show.call(this);

        for (let i = 0; i < this.rays.length; i++){
            this.rays[i].show();
        }
    }

    rotate (angle) {
        this.headAngle += angle;
        this.headAngle %= 2 * Math.PI;

        for (let i = 0; i < this.rays.length; i++) {
            this.rays[i].rotateRad(angle);
        }
    }

    behave() {
        this.look(tank, walls);

        if (this.playerFound) {
            this.shoot();
        }
        else {
            this.rotate(0.02);
        }
    }
}