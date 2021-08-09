var scene;

var tank = {
    head: null,
    gunTip: null,
    body: null,
    tires: null
};

function displayTank() {
    scene.add(tank.head);
    scene.add(tank.gunTip);
    scene.add(tank.body);
    scene.add(tank.tires);
};


function gameTick() {
    
}