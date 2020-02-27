class Page {
    constructor() {
        var that = this;
        $('.main').css('display', 'none');
        $('.color').css('display', 'none');
        $('.user').css('display', 'none');
        $(".people-cnt").click(function() {
            let x = $(this).attr('data');
            let str;
            $(".people-cnt").css('border', '');
            $(".people-cnt").css('color', '');
            if (x == 1) {
                str = 'var(--red)';
            } else if (x == 2) {
                str = 'var(--blue)';
            } else if (x == 3) {
                str = 'var(--green)';
            } else {
                str = 'var(--yellow)';
            }
            $(this).css('border-color', str);
            $(this).css('color', str);
            that.peopleCnt = parseInt(x);
        })
    }
    checkRoom(nick, room) {
        let room_pattern = /^[a-zA-Z0-9]{4,10}$/;
        let nick_pattern = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,15}$/;

        let flag1 = room_pattern.test(room);
        let flag2 = nick_pattern.test(nick);

        $('.error').text('')
        if (!flag1) {
            $('.error').append('<li>房间代码必须是4到10位的数字或字母</li>');
        }
        if (!flag2) {
            $('.error').append('<li>用户名必须是1到15位的数字、字母或者中文</li>');
        }
        if (!flag1 || !flag2) {
            $('.error').css('visibility', '');
            return false;
        }
        return true;
    }
    getVal(selector) {
        return $(selector).val();
    }
    getPeopleCnt() {
        return this.peopleCnt;
    }
    showRoomError(data) {
        if (data.code == status.ERROR_ROOM_FULL) {
            $('.error').html('<li>该房间人数已满，无法加入</li>');
            $('.error').css('visibility', '');
        } else if (data.code == status.ERROR_ROOM_CNT) {
            $('.error').html('<li>该房间号已经被占用，要么选对人数，要么换个房间</li>');
            $('.error').css('visibility', '');
        } else if (data.code == status.ERROR_ROOM_BEGIN) {
            $('.error').html('<li>该房间正在游戏中，无法加入</li>');
            $('.error').css('visibility', '');
        } else {
            $('.error').html('<li>您好像在试图hack~</li>');
            $('.error').css('visibility', '');
        }
    }
    showColorPage() {
        $('.join').css('display', 'none');
        $('.color').css('display', '');
    }
    showGamePage() {
        $('.color').css('display', 'none');
        $('.main').css('display', '');
    }
    updateColor(data) {
        let x = data.room.leftColor;
        let map = {}
        for (let x in data.room.users) {
            let i = data.room.users[x];
            switch (i.color) {
                case RED_NO:
                    map[RED_NO] = i.nickname;
                    break;
                case BLUE_NO:
                    map[BLUE_NO] = i.nickname;
                    break;
                case GREEN_NO:
                    map[GREEN_NO] = i.nickname;
                    break;
                case YELLOW_NO:
                    map[YELLOW_NO] = i.nickname;
                    break;
            }
        }
        if (x >= YELLOW_NO) {
            x -= YELLOW_NO;
            $('#yellow').addClass('yellow-shadow');
        } else {
            $('#yellow').removeClass('yellow-shadow').text(map[YELLOW_NO]);
        }
        if (x >= GREEN_NO) {
            x -= GREEN_NO;
            $('#green').addClass('green-shadow');
        } else {
            $('#green').removeClass('green-shadow').text(map[GREEN_NO]);
        }
        if (x >= BLUE_NO) {
            x -= BLUE_NO
            $('#blue').addClass('blue-shadow');
        } else {
            $('#blue').removeClass('blue-shadow').text(map[BLUE_NO]);
        }
        if (x >= RED_NO) {
            x -= RED_NO;
            $('#red').addClass('red-shadow');
        } else {
            $('#red').removeClass('red-shadow').text(map[RED_NO]);
        }
    }
}

function updateConnection(socket) {
    let oldid = socketid;
    let newid = socket.id;
    socket.emit("reconnect", oldid, newid);
    socketid = newid;
}