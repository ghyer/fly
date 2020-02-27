const StatusConst = require('./Status');
const GameInter = require('./Game');
const RoomsClass = require('./Rooms');
const MapClass = require('./Map');

var rooms = new RoomsClass();
var map = new MapClass();

function test(data, pattern) {
    return pattern.test(data);
}

class Control {
    constructor() {}

    joinRoom(socket, data) {
        var nickname = data.nickname;
        var roomname = data.room;
        var peopleCnt = data.peopleCnt;
        var id = socket.id;
        // No string
        if (id == undefined ||
            id == null ||
            nickname == undefined ||
            nickname == null ||
            roomname == undefined ||
            roomname == null) {
            return { code: StatusConst.ERROR_EMPTY };
        }
        // Beyond limit
        if (peopleCnt != null && (peopleCnt < 1 || peopleCnt > 4)) {
            return { code: StatusConst.ERROR_INPUT };
        }
        // Already join room
        if (map.test(id)) {
            return { code: StatusConst.ERROR_ROOM_IN };
        }
        // Wrong string
        let flag1 = test(roomname, /^[a-zA-Z0-9]{4,10}$/);
        let flag2 = test(nickname, /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,15}$/);
        if (!flag1 || !flag2) {
            return { code: StatusConst.ERROR_INPUT };
        }
        // Room doesn't exist
        if (!rooms.test(roomname)) {
            if (peopleCnt == null || peopleCnt == undefined) {
                peopleCnt = 4;
            }
            // Add a new room
            rooms.addRoom(roomname, peopleCnt);
        }
        // People amount isn't equal to room's people amount
        if (peopleCnt != null && peopleCnt != rooms.getPeopleCnt(roomname)) {
            return { code: StatusConst.ERROR_ROOM_CNT };
        }
        // Room already begin game
        if (rooms.getBeginStatus(roomname)) {
            return { code: StatusConst.ERROR_ROOM_BEGIN };
        }
        // Room's users are full
        if (rooms.getUsersCnt(roomname) == rooms.getPeopleCnt(roomname)) {
            return { code: StatusConst.ERROR_ROOM_FULL };
        }

        // Let socket join the room
        socket.join(roomname);
        map.setRoom(id, roomname);
        rooms.newUser(roomname, id, nickname);

        return {
            code: StatusConst.ACCEPT,
            room: rooms.getRoom(roomname)
        };
    }

    chooseColor(socket, color) {
        let id = socket.id;
        let roomname = map.getRoom(id);
        if (id == undefined ||
            id == null ||
            roomname == undefined ||
            roomname == null ||
            color == undefined ||
            color == null) {
            return { code: StatusConst.ERROR_EMPTY };
        }
        // Beyond limit
        color = parseInt(color);
        if (color != 1 && color != 2 && color != 4 && color != 8) {
            return { code: StatusConst.ERROR_COLOR_NUMBER };
        }
        // Color chosen
        let leftColor = rooms.getLeftColor(roomname);
        let tmp = {};
        if (leftColor >= 8) {
            leftColor -= 8;
            tmp[8] = true;
        } else
            tmp[8] = false;
        if (leftColor >= 4) {
            leftColor -= 4;
            tmp[4] = true;
        } else
            tmp[4] = false;
        if (leftColor >= 2) {
            leftColor -= 2;
            tmp[2] = true;
        } else
            tmp[2] = false;
        if (leftColor >= 1) {
            leftColor -= 1;
            tmp[1] = true;
        } else
            tmp[1] = false;
        if (tmp[color] == false) {
            return { code: StatusConst.ERROR_COLOR_CHOSEN };
        }

        let users = rooms.getUsers(roomname)
        for (let i in users) {
            if (users[i].id == socket.id) {
                // User chosen
                if (users[i].color != undefined) {
                    return { code: StatusConst.ERROR_COLOR_AGAIN };
                }
                // Set color to user
                rooms.setColor(roomname, i, color);
                break;
            }
        }

        if (users.length == rooms.getPeopleCnt(roomname) && rooms.allChosenColor(roomname)) {
            rooms.setBegin(roomname);
            return {
                code: StatusConst.BEGIN,
                room: rooms.getRoom(roomname),
                pos: {
                    'red': {
                        '1': [{ x: 62, y: 33 }],
                        '2': [{ x: 62, y: 90 }],
                        '3': [{ x: 118, y: 90 }],
                        '4': [{ x: 118, y: 33 }]
                    },
                    'blue': {
                        '1': [{ x: 61, y: 415 }],
                        '2': [{ x: 61, y: 472 }],
                        '3': [{ x: 117, y: 472 }],
                        '4': [{ x: 117, y: 415 }]
                    },
                    'green': {
                        '1': [{ x: 434, y: 415 }],
                        '2': [{ x: 434, y: 472 }],
                        '3': [{ x: 490, y: 472 }],
                        '4': [{ x: 490, y: 415 }]
                    },
                    'yellow': {
                        '1': [{ x: 435, y: 33 }],
                        '2': [{ x: 435, y: 90 }],
                        '3': [{ x: 490, y: 90 }],
                        '4': [{ x: 490, y: 33 }]
                    }
                }
            };
        }
        return {
            code: StatusConst.ACCEPT,
            room: rooms.getRoom(roomname)
        };
    }

    getDice(socket) {
        let id = socket.id;
        let roomname = map.getRoom(id);
        if (id == undefined ||
            id == null ||
            roomname == undefined ||
            roomname == null) {
            return { error: StatusConst.ERROR_EMPTY };
        }
        // Not now
        if (rooms.getDice(roomname) != 0) {
            return { error: StatusConst.ERROR_INPUT };
        }
        // Not for you
        let turn = rooms.getTurn(roomname);
        let color = rooms.getUserColorFromRoom(roomname, socket.id)
        if (color != turn)
            return { error: StatusConst.ERROR_TURN };
        let number = GameInter.dice();
        rooms.setDice(roomname, number);

        // io.in(room).emit(SEND_DICE, number);
        if (number != 6) {
            let sum = 0;
            let now = rooms.getNow(roomname);
            for (let i = 1; i <= 4; i++) {
                sum += now[turn][i];
            }
            // Next turn
            if (sum == -4) {
                rooms.setTurn(roomname, GameInter.nextTurn(turn, now));
                let data = {
                    code: StatusConst.ACCEPT_DICE_NEXTTURN,
                    room: rooms.getRoom(roomname)
                };
                rooms.setDice(roomname, 0);
                return data;
            }
        }
        return {
            code: StatusConst.ACCEPT,
            room: rooms.getRoom(roomname)
        };
    }

    movePiece(socket, pieceChosen) {
        let id = socket.id;
        let roomname = map.getRoom(id);
        let piece = parseInt(pieceChosen);
        if (id == undefined ||
            id == null ||
            roomname == undefined ||
            roomname == null ||
            piece == undefined ||
            piece == null) {
            return { code: StatusConst.ERROR_EMPTY };
        }
        // Beyond limit
        if (piece != 1 && piece != 2 && piece != 3 && piece != 4)
            return { code: StatusConst.ERROR_INPUT };
        // Should get a dice, not move a piece
        if (rooms.getDice(roomname) == 0)
            return { code: StatusConst.ERROR_PIECE_DICE };
        // Not for this id
        let users = rooms.getUsers(roomname);
        let turn = rooms.getTurn(roomname);
        for (let i in users) {
            if (users[i].id == id) {
                if (turn == users[i].color)
                    break;
                else
                    return { code: StatusConst.ERROR_PIECE_ID };
            }
        }

        let now = rooms.getNow(roomname);
        let dice = rooms.getDice(roomname);
        // Already finished piece
        if (now[turn][piece] == 56)
            return { code: StatusConst.ERROR_PIECE_AGAIN };
        // Dice is not 6, but you want to begin fly
        if (now[turn][piece] == -1 && dice != 6)
            return { code: StatusConst.ERROR_PIECE_AGAIN };

        let status = GameInter.play(piece, rooms.getRoom(roomname));
        rooms.update(roomname, status);
        return {
            code: StatusConst.ACCEPT,
            pos: status.pos,
            room: rooms.getRoom(roomname)
        }
    }
}

module.exports = Control