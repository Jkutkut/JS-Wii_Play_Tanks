class Mine {
    constructor(parent){
        this.parent = parent;
        this.pos = parent.pos.copy(); // Position


        this.PHASES = {
            TICKING:   0,
            EXPANDING: 1,
            MAXSIZE:   2,
            REDUCTION: 3,
            DESTROYED: 4
        }
        this.phase = 0;

        this.properties = {
            naturalSize: 15,
            detonationTime: 300,

            maxSize: 100,
            deltaGrow: 4,
            maxExplosionTime: 15
        };
        this.mineC = {
            normal: 255,
            explosion: 150
        };

        this.time = this.properties.detonationTime;
        this.size = this.properties.naturalSize;
        this.destroyed = false;
    }

    show() {
        if (this.phase == this.PHASES.DESTROYED) { // if Object pending of disapearing
            return; // Do not show
        }
        push();
            if (this.phase == this.PHASES.TICKING) {
                fill(this.mineC.normal);
            }
            else { // If 0 < phase < 4 
                fill(this.mineC.explosion);
            }
            translate(this.pos);
            ellipse (0, 0, this.size);

        pop();
    }

    tick () {
        switch(this.phase) {
            case this.PHASES.TICKING:
                this.time--;
                if (this.time == 0) {
                    this.phase = this.PHASES.EXPANDING;
                }
            break;
            case this.PHASES.EXPANDING:
                this.size += this.properties.deltaGrow;
                if (this.size >= this.properties.maxSize) {
                    this.phase = this.PHASES.MAXSIZE;
                    this.time = this.properties.maxExplosionTime;
                }
            break;
            case this.PHASES.MAXSIZE:
                this.time--;
                if (this.time == 0) {
                    this.phase = this.PHASES.REDUCTION;
                }

            break;
            case this.PHASES.REDUCTION:
                this.size -= this.properties.deltaGrow;
                if (this.size <= 0) {
                    this.phase = this.PHASES.DESTROYED;
                    this.parent.abilityDestroyed();
                }
            break;
            // case this.PHASES.DESTROYED: do nothing
        }
    }

    hasBeenDestroyed () {
        return this.phase == this.PHASES.DESTROYED;
    }
}