class Bullet{
    constructor(parent){
        let parentPos = parent.pos.copy();
        
        this.direction = p5.Vector.fromAngle(parent.headAngle);

        let bulletPosFromParent = this.direction.copy();
        let distCenterTankToTip = 
            parent.tankSize.head.width / 2 +
            parent.tankSize.head.gun.len + 
            parent.tankSize.head.gunTip.len;

        bulletPosFromParent.add(distCenterTankToTip);

        this.pos = parentPos.add(bulletPosFromParent);

        this.parent = parent;
        this.bulletSize = parent.tankSize.bullet;

        
        this.angle = parent.headAngle;
        this.v = this.bulletSize.p.v;

        this.direction.mult(this.v)

        this.bulletC = this.parent.tankColor;
    }
    show(){
        // stroke(200, 200, 200);
        // strokeWeight(2);
        push();
            translate(this.pos);
            push(); 
                rotate(this.angle);
                
                // rotate(this.angle - Math.PI / 2);
                fill(this.bulletC.bullet);

                rect(...this.parent.shape("box", this.bulletSize.len));
                translate(this.bulletSize.len, 0);
                ellipse(0, 0, this.bulletSize.len, this.bulletSize.width);
            pop();
        pop();
    }

    move(){
        this.pos.add(this.direction);
    }

    validSpot(){
        // return Math.abs(this.pos.x) < width / 2 && Math.abs(this.pos.y) < height / 2;
        return true;
    }
}