const direction = {
    left: 0,
    right: 0,
    up: 0,
    down: 0
};

function move(id) {
    const inputField = document.getElementById(id);
    direction[id] += 1;
    inputField.value = direction[id];
}

function movePlayer() {
    console.log('moved');
    const button = document.getElementById('movePlayer');
    button.value = JSON.stringify(direction);
}