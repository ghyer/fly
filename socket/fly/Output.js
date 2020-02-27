function print(name, data) {
    let date = new Date();
    console.log(date.toLocaleString() + ' OUTPUT ' + name + ':');
    console.log(data);
}

var Output = {
    showColor(socket, data) {
        print(socket.id, data);
        socket.emit('showColor', data);
    },
    errorRoom(socket, data) {
        print(socket.id, data);
        socket.emit('errorRoom', data);
    },
    updateColor(room, data) {
        print(room.rooms[0], data);
        room.emit('updateColor', data);
    },
    beginGame(room, data) {
        setTimeout(function() {
            print(room.rooms[0], data);
            room.emit('beginGame', data);
        }, 3000);
        print(room.rooms[0], data);
        room.emit('updateStatus', data);
    },
    sendError(socket, data) {
        print(socket.id, data)
        socket.emit('Error', data);
    },
    sendDice(room, data) {
        print(room.rooms[0], data);
        room.emit('dice', data);
    },
    updateStatus(room, data) {
        print(room.rooms[0], data);
        room.emit('updateStatus', data);
    },
    choosePieceAgain(socket, data) {
        print(socket.id, data);
        socket.emit('pieceAgain', data);
    }
}

module.exports = Output;