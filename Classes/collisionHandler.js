class CollisionHandler {
    constructor (playerTank, walls) {
        this.walls = walls;
        this.tanks = [playerTank];

        this.delta = 5.0001;
    }





    collidingBulletBorderWall(bullet) {
        let verti = bullet.pos.x - (this.walls[0].pos.x + this.walls[0].size.w) < this.delta && bullet.direction.x < 0 ||
                    this.walls[1].pos.x - bullet.pos.x < this.delta && bullet.direction.x > 0;

        if (verti) {
            return 1;
        }

        let hori = bullet.pos.y - (this.walls[2].pos.y + this.walls[2].size.h) < this.delta && bullet.direction.y < 0 ||
        this.walls[3].pos.y - bullet.pos.y < this.delta && bullet.direction.y > 0;
        
        if (hori) {
            return -1;
        }
        return 0;
    }

    bulletAniquilation (bullets) {
        // if 2 bullets colide, eliminate them
        for (let i = 0; i < bullets.length; i++) {
            let primaryBullet = bullets[i];
            for (let j = i + 1; j < bullets.length; j++){
                let secondaryBullet = bullets[j];
                if (this.collide(primaryBullet, secondaryBullet)) {
                    bullets.splice(j, 1);
                    bullets.splice(i, 1);
                    i--;
                    break;
                }
            }
        }
    }

    collide(obj1, obj2) {
        let delta = 1 * this.delta;
        return  delta < obj2.pos.x + obj2.size.w - obj1.pos.x &&
                obj1.pos.x + obj1.size.w - obj2.pos.x > delta &&
                delta < obj2.pos.y + obj2.size.h - obj1.pos.y &&
                obj1.pos.y + obj1.size.h - obj2.pos.y > delta
    }
}