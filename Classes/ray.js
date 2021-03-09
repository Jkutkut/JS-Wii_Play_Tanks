// Code based on Daniel's Shiffman code
// https://thecodingtrain.com/CodingChallenges/145-2d-ray-casting.html
// https://youtu.be/TOEi6T2mtHo

// 2D Ray Casting

class Ray {
    constructor(pos, angle) {
        this.pos = pos;
        this.dir = p5.Vector.fromAngle(angle);
    }
  
    lookAt(x, y) {
        this.dir.x = x - this.pos.x;
        this.dir.y = y - this.pos.y;
        this.dir.normalize();
    }

    rotateDeg(angle) {
        this.rotateRad(radians(angle));
    }
    rotateRad(angle) {
        this.dir.rotate(angle);
    }
  
    show() {
        push();
        stroke(255, 255, 255, 20);
        translate(this.pos.x, this.pos.y);
        line(0, 0, this.dir.x * 50, this.dir.y * 50);
        pop();
    }
  
    cast(obj) {
        let objSAT = obj.getSATdata();
        // console.log(objSAT);

        const x3 = this.pos.x;
        const y3 = this.pos.y;
        const x4 = this.pos.x + this.dir.x;
        const y4 = this.pos.y + this.dir.y;


        let pointsFound = [];

        for (let line = 0; line < 4; line++) { // For each edge on the hitbox
            const x1 = objSAT.points[line].x + objSAT.pos.x;
            const y1 = objSAT.points[line].y + objSAT.pos.y;
            const x2 = objSAT.points[(line + 1) % 4].x + objSAT.pos.x;
            const y2 = objSAT.points[(line + 1) % 4].y + objSAT.pos.y;
        
            const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
            
            if (den == 0) {
                continue;
            }
        
            const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
            const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
            
            // console.log(t)
            // console.log(u)
            if (t > 0 && t <= 1 && u > 0) {
                // console.log("found!")
                const pt = createVector();
                pt.x = x1 + t * (x2 - x1);
                pt.y = y1 + t * (y2 - y1);
                pointsFound.push(pt);
            } else {
                // console.log("Not found")
                continue;
            }
        }

        switch(pointsFound.length) {
            case 0:
                return; // no solutions found
            default: // More than one intersection
                let minDis = Infinity;
                let index = null;
                for (let i = 0; i < pointsFound.length; i++){
                    let dist = this.pos.dist(pointsFound[i]);
                    if (dist < minDis) {
                        minDis = dist;
                        index = i;
                    }
                }
                // console.log(pointsFound[index]);
                return pointsFound[index];
        }
        
    }
  }
  