const PositionConst = require('./Position.js');

function nextTurn(current_turn, now) {
    let turn1 = now['1'][1] + now['1'][2] + now['1'][3] + now['1'][4];
    let turn2 = now['2'][1] + now['2'][2] + now['2'][3] + now['2'][4];
    let turn4 = now['4'][1] + now['4'][2] + now['4'][3] + now['4'][4];
    let turn8 = now['8'][1] + now['8'][2] + now['8'][3] + now['8'][4];
    let sum = 56 * 4;
    if (current_turn == 1) {
        if (turn2 == sum) {
            if (turn4 == sum) {
                return 8;
            } else {
                return 4;
            }
        } else {
            return 2;
        }
    }
    if (current_turn == 2) {
        if (turn4 == sum) {
            if (turn8 == sum) {
                return 1;
            } else {
                return 8;
            }
        } else {
            return 4;
        }
    }
    if (current_turn == 4) {
        if (turn8 == sum) {
            if (turn1 == sum) {
                return 2;
            } else {
                return 1;
            }
        } else {
            return 8;
        }
    }
    if (current_turn == 8) {
        if (turn1 == sum) {
            if (turn2 == sum) {
                return 4;
            } else {
                return 2;
            }
        } else {
            return 1;
        }
    }
}

function eat(turn, now, pos) {
    let phy_pos = PositionConst.available[PositionConst.colorStr[turn]][pos];
    let ans = [];
    let str;
    for (let i in now) {
        if (i == turn) {
            continue;
        }
        str = PositionConst.colorStr[i]
        for (let j = 1; j <= 4; j++) {
            if (PositionConst.available[str][now[i][j]] == phy_pos) {
                ans.push({
                    color: i,
                    piece: j
                })
            }
        }
    }
    return ans;
}

function dice() {
    number = Math.ceil(Math.random() * 6);
    // return 6;
    return number;
}

function play(piece, room) {
    // The most important game's function.
    let dice = room.dice;
    let turn = room.turn;
    let now = room.now;
    let colorStr = PositionConst.colorStr[turn];
    let status = {
        'now': now,
        'turn': nextTurn(turn, now),
        'pos': {
            'red': {
                '1': [],
                '2': [],
                '3': [],
                '4': [],
            },
            'blue': {
                '1': [],
                '2': [],
                '3': [],
                '4': [],
            },
            'green': {
                '1': [],
                '2': [],
                '3': [],
                '4': [],
            },
            'yellow': {
                '1': [],
                '2': [],
                '3': [],
                '4': [],
            },
        }
    };

    // Start fly
    if (now[turn][piece] == -1) {
        status.turn = turn;
        status.now = now;
        status.now[turn][piece] = 0;
        status['pos'][colorStr][piece].push(PositionConst.getXY(colorStr, 0));
        return status;
    }

    // Finish fly and return
    if (now[turn][piece] + dice > 56) {
        let i = 1;
        let tmp = now[turn][piece];
        while (tmp + i <= 56) {
            status['pos'][colorStr][piece].push(PositionConst.getXY(colorStr, tmp + i));
            i++;
        }
        let j = 1;
        while (i <= dice) {
            status['pos'][colorStr][piece].push(PositionConst.getXY(colorStr, 56 - j));
            i++;
            j++;
        }
        // 更新位置
        status.now[turn][piece] = 56 - j + 1;
        // 该选手是否结束游戏
        if (dice == 6) {
            let sum = 0;
            for (let k = 1; k <= 4; k++) {
                sum += now[turn][k];
            }
            if (sum != 56 * 4) {
                status.turn = turn;
            }
        }
        return status;
    }

    // 中间情况
    // 先正常行走
    let tmp = now[turn][piece];
    let to = tmp + dice;
    for (let i = 1; i <= dice; i++) {
        // 移动棋子
        status['pos'][colorStr][piece].push(PositionConst.getXY(colorStr, tmp + i));
    }
    // 更新行走后的现在位置
    status.now[turn][piece] = to;

    // 判断是否吃子
    let ate = eat(turn, now, status.now[turn][piece]);
    if (ate.length != 0) {
        for (let i in ate) {
            let ate_str = PositionConst.colorStr[ate[i].color];
            // 移动被吃子
            status['pos'][ate_str][ate[i].piece].push(PositionConst.getXY(ate_str, -1, ate[i].piece));
            // 更新被吃子的现在位置
            status.now[ate[i].color][ate[i].piece] = -1;
        }
    }

    // 判断是否可以飞子
    if (PositionConst.fly['from'] == status.now[turn][piece]) {
        // 移动飞子
        status['pos'][colorStr][piece].push(PositionConst.getXY(colorStr, PositionConst.fly['to']));
        // 更新飞子后位置
        status.now[turn][piece] = PositionConst.fly['to'];
        // 判断是否吃子
        ate = eat(turn, now, status.now[turn][piece]);
        if (ate.length != 0) {
            for (let i in ate) {
                let ate_str = PositionConst.colorStr[ate[i].color];
                // 移动被吃子
                status['pos'][ate_str][ate[i].piece].push(PositionConst.getXY(ate_str, -1, ate[i].piece));
                // 更新被吃子的现在位置
                status.now[ate[i].color][ate[i].piece] = -1;
            }
        }
        // 飞子以后可以跳子
        for (let i in PositionConst.jump) {
            if (PositionConst.fly['to'] == PositionConst.jump[i]) {
                // 移动跳子
                status['pos'][colorStr][piece].push(PositionConst.getXY(colorStr, PositionConst.jump[i + 1]));
                // 更新跳子现在位置
                status.now[turn][piece] = PositionConst.jump[i + 1];
                // 判断是否吃子
                ate = eat(turn, now, status.now[turn][piece]);
                if (ate.length != 0) {
                    for (let i in ate) {
                        let ate_str = PositionConst.colorStr[ate[i].color];
                        // 移动被吃子
                        status['pos'][ate_str][ate[i].piece].push(PositionConst.getXY(ate_str, -1, ate[i].piece));
                        // 更新被吃子的现在位置
                        status.now[ate[i].color][ate[i].piece] = -1;
                    }
                }
                break;
            }
        }
        if (dice == 6) {
            status.turn = turn;
        }
        return status;
    }

    // 判断是否可以跳子
    for (let i = 0; i <= 11; i++) {
        if (status.now[turn][piece] == PositionConst.jump[i]) {
            // 移动跳子
            status['pos'][colorStr][piece].push(PositionConst.getXY(colorStr, PositionConst.jump[i + 1]));
            // 更新跳子位置
            status.now[turn][piece] = PositionConst.jump[i + 1];
            // 判断是否吃子
            let ate = eat(turn, now, status.now[turn][piece]);
            if (ate.length != 0) {
                for (let i in ate) {
                    let ate_str = PositionConst.colorStr[ate[i].color];
                    // 移动被吃子
                    status['pos'][ate_str][ate[i].piece].push(PositionConst.getXY(ate_str, -1, ate[i].piece));
                    // 更新被吃子的现在位置
                    status.now[ate[i].color][ate[i].piece] = -1;
                }
            }
            // 判断是否飞子
            if (PositionConst.fly['from'] == status.now[turn][piece]) {
                // 移动飞子
                status['pos'][colorStr][piece].push(PositionConst.getXY(colorStr, PositionConst.fly['to']));
                // 更新飞子后位置
                status.now[turn][piece] = PositionConst.fly['to'];
                // 判断是否吃子
                let ate = eat(turn, now, status.now[turn][piece]);
                if (ate.length != 0) {
                    for (let i in ate) {
                        let ate_str = PositionConst.colorStr[ate[i].color];
                        // 移动被吃子
                        status['pos'][ate_str][ate[i].piece].push(PositionConst.getXY(ate_str, -1, ate[i].piece));
                        // 更新被吃子的现在位置
                        status.now[ate[i].color][ate[i].piece] = -1;
                    }
                }
            }
            if (dice == 6) {
                status.turn = turn;
            }
            return status;
        }
    }

    if (dice == 6) {
        status.turn = turn;
    }
    return status;
}

module.exports = {
    nextTurn,
    dice,
    play
}