class MinePrototype {
    constructor(parent, properties, colors){
        this.PHASES = {
            TICKING:   0,
            EXPANDING: 1,
            MAXSIZE:   2,
            REDUCTION: 3,
            DESTROYED: 4
        }

        this.parent = parent;
        this.pos = parent.pos.copy(); // Position

        this.phase = 0;

        this.properties = properties;
        this.mineC = colors;

        this.time = this.properties.detonationTime;
        this.size = this.properties.naturalSize;
        this.destroyed = false;


        this.SATdata = new SAT.Circle(new SAT.Vector(this.pos.x, this.pos.y), this.properties.naturalSize * 0.5);
    }

    /*  GETTERS AND SETTERS */
    getSize() {
        return this.size;
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

    trigger() {
        if (this.phase != this.PHASES.TICKING) {
            return;
        }
        this.time = 0;
        this.phase = this.PHASES.EXPANDING;
    }

    hasBeenDestroyed () {
        return this.phase == this.PHASES.DESTROYED;
    }

    getSATdata() {
        if (this.phase != this.PHASES.TICKING && this.phase != this.PHASES.MAXSIZE) {
            this.SATdata = new SAT.Circle(new SAT.Vector(this.pos.x, this.pos.y), this.size * 0.5);
        }
        return this.SATdata;
    }
}

class Mine extends MinePrototype {
    constructor (parent) {
        super(parent, objectProperties.mine.normal, COLORS.mine.mine);
    }
}