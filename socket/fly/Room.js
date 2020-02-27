class Room {
    constructor(roomname, peopleCnt) {
        this.data = {
            name: roomname,
            dice: 0,
            turn: 1,
            begin: false,
            users: [],
            leftColor: 15,
            peopleCnt: peopleCnt,
            now: {
                '1': [0, -1, -1, -1, -1],
                '2': [0, -1, -1, -1, -1],
                '4': [0, -1, -1, -1, -1],
                '8': [0, -1, -1, -1, -1]
            },
        };
    }
    getData() {
        return this.data;
    }
    getTurn() {
        return this.data.turn;
    }
    getDice() {
        return this.data.dice;
    }
    getUsers() {
        return this.data.users;
    }
    getPeopleCnt() {
        return this.data.peopleCnt;
    }
    getLeftColor() {
        return this.data.leftColor;
    }
    getBegin() {
        return this.data.begin;
    }
    getNow() {
        return this.data.now;
    }
    setNewUser(id, nickname) {
        this.data.users.push({
            id: id,
            color: null,
            nickname: nickname,
        });
    }
    setColor(index, color) {
        this.data.leftColor -= color;
        this.data.users[index].color = color;
    }
    setDice(dice) {
        this.data.dice = dice;
    }
    setTurn(nextTurn) {
        this.data.turn = nextTurn;
    }
    setBegin() {
        this.data.begin = true;
    }
    setNow(now) {
        this.data.now = now;
    }
}

module.exports = Room;