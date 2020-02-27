const RoomClass = require("./Room");
class Rooms {
    constructor() {
        this.rooms = {};
    }
    test(roomname) {
        if (this.rooms[roomname] == undefined)
            return false;
        return true;
    }
    allChosenColor(roomname) {
        let users = this.rooms[roomname].getUsers();
        for (let i in users)
            if (users[i].color == null)
                return false;
        return true;
    }
    getBeginStatus(roomname) {
        return this.rooms[roomname].getBegin();
    }
    getUsersCnt(roomname) {
        return this.rooms[roomname].getUsers().length;
    }
    getPeopleCnt(roomname) {
        return this.rooms[roomname].getPeopleCnt();
    }
    getRoom(roomname) {
        return this.rooms[roomname].getData();
    }
    getUsers(roomname) {
        return this.rooms[roomname].getUsers();
    }
    getTurn(roomname) {
        return this.rooms[roomname].getTurn();
    }
    getUserColorFromRoom(roomname, id) {
        let users = this.rooms[roomname].getUsers();
        for (let i in users) {
            if (users[i].id == id) {
                return users[i].color;
            }
        }
    }
    getNow(roomname) {
        return this.rooms[roomname].getNow();
    }
    getLeftColor(roomname) {
        return this.rooms[roomname].getLeftColor();
    }
    getDice(roomname) {
        return this.rooms[roomname].getDice();
    }
    newUser(roomname, id, nickname) {
        this.rooms[roomname].setNewUser(id, nickname);
    }
    addRoom(roomname, peopleCnt) {
        this.rooms[roomname] = new RoomClass(roomname, peopleCnt);
    }
    setColor(roomname, index, color) {
        this.rooms[roomname].setColor(index, color);
    }
    setDice(roomname, dice) {
        this.rooms[roomname].setDice(dice);
    }
    setTurn(roomname, nextTurn) {
        this.rooms[roomname].setTurn(nextTurn);
    }
    setBegin(roomname) {
        this.rooms[roomname].setBegin()
    }
    update(roomname, status) {
        this.rooms[roomname].setTurn(status.turn);
        this.rooms[roomname].setNow(status.now);
        this.rooms[roomname].setDice(0);
    }
}

module.exports = Rooms;