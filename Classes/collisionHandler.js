class CollisionHandler {
    constructor (playerTank, walls) {
        this.walls = walls;
        this.tanks = [playerTank];

        this.delta = 0.001;
    }





    collidingBullet(bullet) {
        let wall = walls[0];
        return Math.abs(wall.pos.x + wall.size.w - bullet.pos.x < delta);
    }
}