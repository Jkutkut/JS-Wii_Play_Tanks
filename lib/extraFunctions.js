function shape(type, w, h) {
    switch(type) {
        case "box":
            let wSize = (w / 2);
            let hSize;

            if (!h) {
                hSize = wSize;
                h = w;
            }
            else {
                hSize = (h / 2);
            }
            return [- wSize, - hSize, w, h];
    }
}