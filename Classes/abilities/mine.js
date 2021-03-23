class Mine{
    constructor(parent){
        this.parent = parent;
        this.pos = parent.pos.copy(); // Position


        // this.phases = {
        //     ticking:   0,
        //     expanding: 1,
        //     maxsize:   2,
        //     reduction: 3,
        //     destroyed: 4
        // }

        this.minSize = 15
        this.maxSize = 100;

        this.time2Detonation = 300;
        this.explosion = this.minSize;
        this.explosionTime = 15;
        this.destroyed = false;
    }

    show() {
        if (this.destroyed) {
            return;
        }
        push();
            translate(this.pos);
            
            if (this.time2Detonation > 0) {
                fill(255);
            }
            else {
                fill(150);
                if (this.explosion < this.maxSize) {
                    this.explosion += 4;
                }
            }
            ellipse (0, 0, this.explosion);

        pop();
    }

    tick () {
        this.time2Detonation--;

        if (this.explosion > this.maxSize) {
            this.explosionTime--;
            if (this.explosionTime == 0) {
                this.destroy();
            }
        }
    }

    destroy () {
        this.destroyed = true;
        this.parent.abilityDestroyed();
    }
}