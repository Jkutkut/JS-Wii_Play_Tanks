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
                bullets[i].destroy(); // Do what needs to be done to end this object
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
            
            if (this.collide(bullet, wall, response)) {
                bullet.bounce(response);
            }
            response.clear();
        }
    }
    // collidingBulletWall(bullet) {
    //     let response = new SAT.Response();
        
    //     let dist = function(p, q, i){
    //         let pp = new SAT.Vector(0, 0).copy(p);
    //         let qq = new SAT.Vector(0, 0).copy(q.pos).add(q.points[i])
    //         let d = pp.sub(qq);
    //         return Math.sqrt(d.x * d.x + d.y + d.y);
    //     }

    //     for (let i = 0; i < this.walls.length; i++) {
    //         let wall = this.walls[i];
            
    //         if (this.collide(bullet, wall, response)) {
    //             let minD = Infinity;
    //             let index;

    //             for (let i = 0; i < 4; i++) {
    //                 let d = dist(response.a.pos, response.b, i);
    //                 if (d < minD) {
    //                     minD = d;
    //                     index = i;
    //                 }
    //             }
                
    //             push()
    //                 stroke(0);
    //                 ellipse(response.a.pos.x, response.a.pos.y, 15)
    //             pop()
                
    //             let po = new SAT.Vector(0, 0).copy(response.b.pos).add(response.b.points[index]);
    //             push()
    //                 stroke(0);
    //                 ellipse(po.x, po.y, 10)
    //             pop()
            
    //             console.log("---------------")
    //             if (minD < bullet.properties.v) {
    //                 // let perpen = new SAT.Vector(0, 0).copy(response.overlapN).perp();
    //                 // let result = perpen.add(response.overlapN).normalize();
    //                 console.log("EDGE");
    //                 // console.log(result)
    //                 // bullet.bounce(result);
    //                 let vect = wall.pos.copy().sub(bullet.pos);
    //                 if (Math.abs(vect.y) < wall.size.h && vect.x > 0 && vect.y < 0) {
    //                     response.overlapV.y *= -1;
    //                     console.log("pling!")
    //                 }
    //             }
    //             console.log(response)
    //             bullet.bounce(response.overlapV.normalize());
    //             // bullet.bounce(response.overlapV.reverse());
    //             console.log("---------------")
    //         }
    //         response.clear();
    //     }
    // }

    bulletAniquilation (bullets) {
        // if 2 bullets colide, eliminate them
        for (let i = 0; i < bullets.length; i++) {
            let primaryBullet = bullets[i];
            for (let j = i + 1; j < bullets.length; j++){
                let secondaryBullet = bullets[j];
                if (this.collide(primaryBullet, secondaryBullet)) {
                    bullets[i].destroy();
                    bullets[j].destroy();
                    bullets.splice(j, 1);
                    bullets.splice(i, 1);
                    i--;
                    break;
                }
            }
        }
    }

    tankAniquilation(tanks, bullets) {
        for (let i = 0; i < tanks.length; i++) {
            let tank = tanks[i];
            for (let j = 0; j < bullets.length; j++){
                let bullet = bullets[j];
                if (this.collide(tank, bullet)) {
                    bullets.splice(j, 1);
                    tanks.splice(i--, 1);
                    break;
                }
            }
        }
    }

    canGoHere(obj) {
        let response = new SAT.Response();
        for (let i = 0; i < this.walls.length; i++) {
            response.clear();
            if (this.collide(walls[i], obj, response)) {
                return response;
            }
        }
        for (let i = 0; i < this.tanks.length; i++){
            response.clear();
            if (this.tanks[i] == obj) {
                continue;
            }

            if (this.collide(this.tanks[i], obj, response)){
                return response;
            }
        }
        return true;
    }

    collide(obj1, obj2, response=null) {
        return SAT.testPolygonPolygon(obj1.getSATdata(), obj2.getSATdata(), response);
    }
}