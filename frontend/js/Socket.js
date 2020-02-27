class Socket {
    // socket
    // id
    constructor() {
        var that = this;
        this.socket = io('http://localhost:3000/fly');
        this.socket.on('connect', function() {
            that.id = that.socket.id;
            that.socket.on('errorRoom', function(data) {
                console.log(data);
                page.showRoomError(data);
            });
            that.socket.on('showColor', function(data) {
                console.log(data);
                page.showColorPage(data);
                page.updateColor(data);
            });
            that.socket.on('updateColor', function(data) {
                console.log(data);
                page.updateColor(data);
            });
            that.socket.on('beginGame', function(data) {
                console.log(data);
                page.showGamePage();
                game.beginGame(that.socket.id, data.room);
            });
            that.socket.on('updateStatus', function(data) {
                console.log(data);
                game.updateStatus(data);
            });
            that.socket.on('dice', function(data) {
                console.log(data);
                game.updateDice(data)
            });
            that.socket.on('Error', function(data) {
                console.log(data);
            });
            that.socket.on('pieceAgain', function(data) {
                console.log(data);
            });
            // socket.on('reconnect', function() {

            // });
        });
    }

    getSocket() {
        return this.socket;
    }

    getId() {
        return this.id;
    }
}