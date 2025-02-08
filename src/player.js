
const playerDefaultSymbol = '&#929;';

class Player {
    #playerSymbol = null;
    #playerLocation = null;

    constructor(playerSymbol = playerDefaultSymbol, playerLocation = { x: 0, y: 0 }) {
        this.#playerSymbol = playerSymbol;
        this.#playerLocation = playerLocation;
    }

    movePlayer(movementObject) {
        this.#playerLocation.x += movementObject.x;
        this.#playerLocation.y += movementObject.y;
    }

    getPlayerLocation() {
        return this.#playerLocation;
    }

    getPlayerLocationString() {
        return `${this.#playerLocation.x}, ${this.#playerLocation.y}`;
    }

    getPlayerSymbol() {
        return this.#playerSymbol;
    }
}

export {
    Player
};