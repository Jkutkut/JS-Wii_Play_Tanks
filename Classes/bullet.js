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
        if (collisionV.y == 0) { // vertical wall
            this.direction.x *= -1;
        }
        else {
            this.direction.y *= -1;
        }
        this.angle = this.direction.heading();
        this.bounces--;
    }

    getSATdata() {
        let wid2 = this.properties.len * 0.5;
        let multiplier = 1.5;

        let obj = new SAT.Polygon(
            new SAT.Vector(this.pos.x, this.pos.y),
            [
                new SAT.Vector(-wid2, -wid2),
                new SAT.Vector(-wid2, wid2),
                new SAT.Vector(wid2, wid2),
                new SAT.Vector(this.properties.len, 0),
                new SAT.Vector(wid2, -wid2),
                new SAT.Vector(-wid2, -wid2)
            ].map(x => x.scale(multiplier))
        );
        obj
        obj.rotate(this.angle);
        return obj;
    }

    validSpot(){
        return  this.pos.x > 0               && this.pos.y > 0 && 
                this.pos.x < mainCanvasWidth && this.pos.y < mainCanvasHeight;
    }
}

class NormalBullet extends Bullet {
    constructor(parent) {
        super(parent);

        this.properties = objectProperties.bullet.normal;
        this.bulletC = COLORS.bullet.normal;

        this.init();
        
        this.bounces = 3 + 1;
    }
}
class FastBullet extends Bullet {
    constructor(parent) {
        super(parent);

        this.properties = objectProperties.bullet.fast;
        this.bulletC = COLORS.bullet.fast;

        this.init();

        this.bounces = 5 + 1;
    }
}