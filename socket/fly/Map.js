class Map {
    constructor() {
        this.map = {};
    }
    test(id) {
        if (this.map[id] != undefined) {
            return true;
        }
        return false;
    }
    getRoom(id) {
        return this.map[id];
    }
    setRoom(id, roomname) {
        this.map[id] = roomname;
    }
}
module.exports = Map;