/**
 * Class that defines the basic behaviour of Tanks
 */
class Tank{
    static MESH = {
        head: null,
        body: null
    }

    constructor(x, y, properties, colors){
        
    }

    /**
     * Get's the shape of the body tank in SAT format.
     * @returns SAT Polygon object
     * ! DEPRECATED
     */
    getSATdata() {
        let size2 = { // half of the size
            w: this.size.w * 0.5,
            h: this.size.h * 0.5
        }
        let obj = new SAT.Polygon( // The object to return (not rotated)
            new SAT.Vector(this.pos.x, this.pos.y),
            [
                new SAT.Vector(-size2.w, -size2.h),
                new SAT.Vector(-size2.w, size2.h),
                new SAT.Vector(size2.w, size2.h),
                new SAT.Vector(size2.w, -size2.h),
            ]
        );
        obj.rotate(this.bodyAngle); // Rotate it to get the correct position
        return obj;
    }

    /**
     * Having in mind the input, either it moves in the direction given (if oriented) or rotates to align to the angle.
     * @param {number} desiredAngle angle with the desired direction wanted to move to.
     * ! DEPRECATED
     */
    move(desiredAngle) { 
        let alpha = desiredAngle * Math.PI - this.bodyAngle; //angle between when the body aims and the desired direction

        let dir = 1; // if the movement needed is clockwise or not
        if (alpha < 0) { // If angle negative, reverse direction
            dir = -1;
            alpha *= -1;
        }

        if (alpha >= Math.PI * 0.5) { // If we want to rotate more than half a turn
            alpha = (alpha + Math.PI) % (Math.PI * 2); // Equivalent to ((alpha - π) + 2π) % 2π but positive always
            this.bodyAngle = (this.bodyAngle + Math.PI) % (2 * Math.PI);
            dir *= -1;
        }

        if(alpha > 0.03){ // if angle big => rotate
            let amount = alpha;
            if(alpha > Math.PI / 20) { // If the angle is really big
                amount = (Math.PI / 20); // on this iteration we will only rotate this amount max
            }
            this.bodyAngle += amount * dir;
            if (this.bodyAngle < 0) {
                this.bodyAngle += 2 * Math.PI; // Always keep it positive
            }
            this.bodyD = createVector(Math.cos(this.bodyAngle), Math.sin(this.bodyAngle));
        }
        if (alpha < Math.PI / 6) { // If angle small => move
            let deltaD = p5.Vector.fromAngle(this.bodyAngle).mult(this.properties.v);
            this.advance(deltaD);
        }
    }

    /**
     * Moves the tank the input increment vector
     * @param {Vector} deltaD P5 Vector with the increment of the position
     * ! DEPRECATED
     */
    advance(deltaD) {
        this.pos.add(deltaD);
        if (collisionHandler.canGoHere(this) != true) { // If I can not go there
            deltaD.mult(-1);
            this.pos.add(deltaD); // Reverse move
        }
    }

    /**
     * Teleports the tank to the new position
     * @param {Vector} newPos P5 Vector with the position
     * ! DEPRECATED
     */
    tp(newPos) {
        this.pos = newPos.clone();
    }

    /**
     * Moves the tank the input vector from the current position
     * @param {Vector} deltaV Increment vector
     * ! DEPRECATED
     */
    tpRelative(deltaV) {
        this.pos.add(deltaV);
    }

    /**
     * Aim the head to the selected coordinates
     * @param {int} mX position to aim on the horizontal axis
     * @param {int} mY position to aim on the vertical axis
     * ! DEPRECATED
     */
     aim(mX, mY){
        let mouse = createVector(mX, mY);
        let headDirection = this.pos.copy().sub(mouse); // vector from tank pos to mouse
        this.headAngle = Math.atan(headDirection.y / headDirection.x);
        if (headDirection.x >= 0) {
            this.headAngle += Math.PI; // Add it to handle the atan definition
        }
    }

    /**
     * Attemps to shoot a bullet.
     * If the condition to shoot is not acomplish, this method does nothing
     * ! DEPRECATED
     */
    shoot(){
        // If the cooldown has ended and the maximum bullets is not reached
        if (this.shootCooldown < 0 && this.bullets < this.properties.maxBullets) {
            this.bullets++; // Add a bullet
            bullets.push(new this.bulletConstructor(this)); // Create the bullet
            this.shootCooldown = this.properties.shotDelay; // Reset the cooldown
        }
    }

    hability () {

    }

    /**
     * If bullet is destroyed, this method is executed to notify the tank
     * ! DEPRECATED
     */
    bulletDestroyed() {
        this.bullets--;
    }

    abilityDestroyed() {

    }
}

/**
 * Tank for the player, with logic to control it usign the user's input.
 * ! DEPRECATED
 */
class TankPlayer extends Tank {
    constructor (x, y) {
        super(x, y, objectProperties.tank.player, COLORS.tank.player);
    }

    hability() {
        // this.bulletConstructor = FastBullet;
        // this.shoot();
        // this.bulletConstructor = NormalBullet;
        if (collisionHandler.canPlaceMineHere(this)) {
            mines.push(new Mine(this));
        }
    }

    /**
     * Analyces the keys of the user to control the tank rotation and movement of the body.
     * @param {number[]} keys ASCII values of the keys pressed by the user
     */
    keyPress(keys){        
        let desiredPosi = {x: 0, y: 0};
        for(let i = 0; i < keys.length; i++) { // for each key
            switch(keys[i]) { // Analyce each key
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

        // Calc desiredAngle
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
            this.move(desiredAngle); // move the tank
        }
    }
}

/**
 * This class extends the tank class to generalize the AItank class. Following classes will be based on this logic
 * ! DEPRECATED
 */
class TankEnemy extends Tank{
    constructor(x, y, enemyIndex, colors) {
        super(x, y, objectProperties.tank.enemy[enemyIndex], colors);

        this.headAngle = Math.PI;
        
        this.playerFound = false;
        this.playerLastPos = createVector(0, 0);
    
        this.rays = [];

        for (let a = -this.properties.visionAperture; a < this.properties.visionAperture; a++) {
            this.rays.push(new Ray(this.pos, radians(a) + this.headAngle));
        }
    }

    look(tank, wallsToCheck) {
        this.playerFound = false;

        let elements = [tank, ...wallsToCheck];

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
        for(let i = 0; i < this.properties.visionAperture * 2; i++){
            this.rays[i].lookAt(mX, mY);
            this.rays[i].rotateDeg(i - this.properties.visionAperture);
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

class Brown_tank extends TankEnemy {
    constructor(x, y) {
        super(x, y, 0, COLORS.tank.brown_tank);
    }
}

class Teal_tank extends TankEnemy {
    constructor(x, y) {
        super(x, y, 1, COLORS.tank.teal_tank);
    }
}