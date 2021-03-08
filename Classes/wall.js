class Wall {
    constructor (x, y, w, h, angle=0) {
        let w2 = w / 2;
        let h2 = h / 2;

        this.pos = createVector(x, y);
        this.size = {w: w, h: h};
        this.angle = angle;

        this.shape = shape("box", w, h);

        this.SATdata = new SAT.Polygon(
            new SAT.Vector(x, y),
            [
                new SAT.Vector(-w2, -h2),
                new SAT.Vector(-w2, h2),
                new SAT.Vector(w2, h2),
                new SAT.Vector(w2, -h2)
            ]
        );
        this.SATdata.rotate(this.angle);
    }

    show() {
        push()
            fill(boxColor)
            translate(this.pos);
            rotate(this.angle);
            rect(...this.shape);
        pop()
    }

    getSATdata() {
        return this.SATdata;
    }
}