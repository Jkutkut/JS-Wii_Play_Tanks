class Bullet{
    constructor(parent){
        this.parent = parent;
        this.angle = parent.headAngle;
        this.direction = p5.Vector.fromAngle(parent.headAngle); //Normal vector with direction of the head

        let bulletPosFromParent = this.direction.copy();
        let distCenterTankToTip = 
            parent.tankSize.head.width * 0.5 +
            parent.tankSize.head.gun.len;

        bulletPosFromParent.mult(distCenterTankToTip);
        this.pos = bulletPosFromParent.add(parent.pos); // Position
    }

    init() {
        this.direction.mult(this.properties.v); // now this vector represents the increment of distance per time (v)

        this.size = {w: this.properties.len, h: this.properties.width};
    }

    show(){
        push();
            translate(this.pos);
            push(); 
                rotate(this.angle);
                fill(this.bulletC.color);
                beginShape();
                    let wid2 = this.properties.width * 0.5;
                    vertex(-wid2, -wid2);
                    vertex(-wid2, wid2);
                    vertex(wid2, wid2);
                    vertex(this.properties.len * 0.8, 0);
                    vertex(wid2, -wid2);
                    vertex(-wid2, -wid2);
                endShape();
            pop();
        pop();
    }

    move(){
        this.pos.add(this.direction);
    }

    bounce(collisionV) {
        let normalV = createVector(collisionV.overlapN.x, collisionV.overlapN.y);
        this.direction = this.direction.reflect(normalV);

        this.angle = this.direction.heading();
        this.bounces--;
    }

    getSATdata(multiplier=1) {
        let wid2 = this.properties.len * 0.5;

        let obj = new SAT.Polygon(
            new SAT.Vector(this.pos.x, this.pos.y),
            [
                new SAT.Vector(wid2, wid2),
                new SAT.Vector(this.properties.len, 0),
                new SAT.Vector(wid2, -wid2),
                new SAT.Vector(-wid2, -wid2),
                new SAT.Vector(-wid2, wid2),
                new SAT.Vector(wid2, wid2)
                
            ].map(x => x.scale(multiplier))
        );
        obj.rotate(this.angle);
        return obj;
    }

    validSpot(){
        return  this.pos.x > 0               && this.pos.y > 0 && 
                this.pos.x < mainCanvasWidth && this.pos.y < mainCanvasHeight;
    }

    destroy() {
        this.parent.bulletDestroyed();
    }
}

class NormalBullet extends Bullet {
    constructor(parent) {
        super(parent);

        this.properties = objectProperties.bullet.normal;
        this.bulletC = COLORS.bullet.normal;

        this.init();
        
        this.bounces = 1 + 1;
    }
}

class FastBullet extends Bullet {
    constructor(parent) {
        super(parent);

        this.properties = objectProperties.bullet.fast;
        this.bulletC = COLORS.bullet.fast;

        this.init();

        this.bounces = 3 + 1;

        //Debug
        this.direction.mult(0.05);
        this.move();    
        this.move();    
        this.move();    

    }

    show() {
        Bullet.prototype.show.call(this);
        let wid2 = this.properties.len * 0.5;
        let wid3 = this.properties.len / 3 / 2;
        let wid10 = this.properties.len * 0.1;

        push();
            fill(this.bulletC.flameEnd);
            translate(this.pos);
            rotate(this.angle);
            beginShape();
                vertex(-wid2, -wid2 * 0.8);
                vertex(-wid2,  wid2 * 0.8);
                let t = Math.round(Math.random() * 3) + 3;

                vertex(-wid2 * 3, wid2 * 1.2);
                for (let i = 1; i < 2; i++) {
                    vertex(-wid2 * 1.8, wid3 * (i+2));
                    vertex(-wid2 * 2.8, wid3 * (i+1));
                    vertex(-wid2 * 1.8, wid3 * (i));
                }
                vertex(-wid2 * 3, 0);
                for (let i = 1; i < 2; i++) {
                    vertex(-wid2 * 1.8, -wid3 * (i));
                    vertex(-wid2 * 2.8, -wid3 * (i+1));
                    vertex(-wid2 * 1.8, -wid3 * (i+2));
                }
                vertex(-wid2 * 3, -wid2 * 1.2);
                vertex(-wid2, -wid2 * 0.8);
            endShape();
            fill(this.bulletC.flameEnd);
        pop();
    }
}