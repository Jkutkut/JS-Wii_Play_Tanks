class Bullet{
    constructor(parent){
        let parentPos = parent.pos.copy(); //center of the tank
        
        this.direction = p5.Vector.fromAngle(parent.headAngle); //Normal vector with direction of the head

        let bulletPosFromParent = this.direction.copy();
        let distCenterTankToTip = 
            parent.tankSize.head.width * 0.5 +
            parent.tankSize.head.gun.len;

        bulletPosFromParent.mult(distCenterTankToTip);

        this.pos = parentPos.add(bulletPosFromParent);

        this.parent = parent;
        this.bulletSize = parent.tankSize.bullet;

        
        this.angle = parent.headAngle;
        this.v = this.bulletSize.p.v;

        this.direction.mult(this.v)

        this.bulletC = this.parent.tankColor;
    }
    show(){
        push();
            translate(this.pos);
            push(); 
                rotate(this.angle);
                fill(this.bulletC.bullet);
                beginShape();
                    vertex(0, 0);
                    vertex(0, this.bulletSize.len);
                    vertex(this.bulletSize.len, this.bulletSize.len);
                    vertex(this.bulletSize.len * 1.3, this.bulletSize.len * 0.5);
                    vertex(this.bulletSize.len, 0);
                    vertex(0, 0);
                endShape();
            pop();
        pop();
    }

    move(){
        this.pos.add(this.direction);
    }

    bounce(collisionType) {
        if (collisionType == 1) {
            this.direction.x *= -1;
        }
        else {
            this.direction.y *= -1;
        }
        this.angle = this.direction.heading();
    }

    validSpot(){
        return  this.pos.x > 0               && this.pos.y > 0 && 
                this.pos.x < mainCanvasWidth && this.pos.y < mainCanvasHeight;
    }
}