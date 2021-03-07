class CollisionHandler {
    constructor (playerTank, walls) {
        this.walls = walls;
        this.tanks = [playerTank];

        this.delta = 5.0001;
    }





    collidingBullet(bullet) {
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
}