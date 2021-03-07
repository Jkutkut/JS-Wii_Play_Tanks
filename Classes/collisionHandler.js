class CollisionHandler {
    constructor (playerTank, tanks, walls, bullets) {
        this.walls = walls;
        this.tanks = [playerTank, ...tanks];
        this.bullets = bullets;
        this.delta = 5.0001;
    }


    handleCollisions() {
        // Bullets bouncing on walls
        for(let i = 0; i < bullets.length; i++){            
            collisionHandler.collidingBulletWall(bullets[i]);
            if (bullets[i].bounces == 0) { // If no remaing bounces
                bullets.splice(i--, 1);
                continue
            }
        }

        // Bullets killing each other
        collisionHandler.bulletAniquilation(bullets);
        
        // bullets killing tanks
        collisionHandler.tankAniquilation(AItanks, bullets);
    }


    collidingBulletWall(bullet) {
        let response = new SAT.Response();
        for (let i = 0; i < this.walls.length; i++) {
            let wall = this.walls[i];
            
            if (this.collide(wall, bullet, response)) {
                bullet.bounce(response.overlapN);
            }
            response.clear();
        }
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

    tankAniquilation(tanks, bullets) {
        // for (let i = 0; i < tanks.length; i++) {
        //     let tank = tanks[i];
        //     for (let j = 0; j < bullets.length; j++){
        //         let bullet = bullets[j];
        //         if (this.collide(tank, bullet)) {
        //             bullets.splice(j, 1);
        //             tanks.splice(i--, 1);
        //             break;
        //         }
        //     }
        // }
    }

    collide(obj1, obj2, response=null) {
        return SAT.testPolygonPolygon(obj1.getSATdata(), obj2.getSATdata(), response);
    }
}