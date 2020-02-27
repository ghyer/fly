const ControlClass = require('./Control');
const OutputInter = require('./Output');
const StatusConst = require('./Status');

var control = new ControlClass();

function print(socket, data) {
    let date = new Date();
    console.log(date.toLocaleString() + ' INPUT ' + socket.id + ':');
    console.log(data);
}

class Input {
    constructor(io) {
        io.on('connection', function(socket) {
            print(socket, " I am Connected ")
            socket.on('joinRoom', function(data) {
                print(socket, data);
                let res = control.joinRoom(socket, data);
                if (res.code == StatusConst.ACCEPT)
                    OutputInter.showColor(io.in(data.room), res);
                else
                    OutputInter.errorRoom(socket, res);
            });
            socket.on('chooseColor', function(color) {
                print(socket, color);
                let res = control.chooseColor(socket, color);
                if (res.code == StatusConst.ACCEPT)
                    OutputInter.updateColor(io.in(res.room.name), res);
                else if (res.code == StatusConst.BEGIN) {
                    OutputInter.beginGame(io.in(res.room.name), res);
                    OutputInter.updateColor(io.in(res.room.name), res);
                } else
                    OutputInter.sendError(socket, res);
            });
            socket.on('getDice', function(data) {
                print(socket, data);
                let res = control.getDice(socket);
                if (res.code == StatusConst.ACCEPT)
                    OutputInter.sendDice(io.in(res.room.name), res);
                else if (res.code == StatusConst.ACCEPT_DICE_NEXTTURN) {
                    OutputInter.sendDice(io.in(res.room.name), res);
                    OutputInter.updateStatus(io.in(res.room.name), res);
                } else
                    OutputInter.sendError(socket, res);
            });
            socket.on('piece', function(piece) {
                print(socket, "move piece " + piece);
                let res = control.movePiece(socket, piece);
                if (res.code == StatusConst.ACCEPT)
                    OutputInter.updateStatus(io.in(res.room.name), res);
                else if (res.code == StatusConst.ERROR_PIECE_AGAIN) {
                    OutputInter.choosePieceAgain(socket, res);
                } else
                    OutputInter.sendError(socket, res);
            });
            // socket.on('disconnect', function() {
            //     console.log(socket.id + ' exited!');
            //     control.disconnect(socket.id);
            // });
            // socket.on('reconnect', function(oldid, newid) {
            //     console.log('instead of ' + oldid + ' to ' + newid);
            //     control.reconnect(oldid, newid);
            // });
        });
    }
}

module.exports = Input;