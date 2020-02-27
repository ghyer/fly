class Player {
    constructor() {
        this.color = null;
        this.socket = socket.getSocket();
    }
    joinRoom(nick, room, peopleCnt) {
        this.socket.emit('joinRoom', {
            nickname: nick,
            room: room,
            peopleCnt: peopleCnt
        });
    }
    setColor(color) {
        this.socket.emit('chooseColor', color);
    }
    getColor() {
        return this.color;
    }
    getDice() {
        this.socket.emit('getDice', "get dice");
    }
    choosePiece(color, piece) {
        if (color != this.color)
            return false;
        this.socket.emit('piece', piece);
    }
}