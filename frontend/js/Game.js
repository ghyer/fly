class Game {
    updateStatus(data) {
        for (let i in data.room.users) {
            $('.turn-' + data.room.users[i].color).text(data.room.users[i].nickname + (data.room.users[i].color == data.room.turn ? '<' : ''));
        }
        for (let i in data.pos) {
            for (let j in data.pos[i]) {
                let plane = '.' + i + '_airplane' + j;
                for (let k in data.pos[i][j]) {
                    let pos = data.pos[i][j][k];
                    $(plane).animate({
                        'top': pos.x,
                        'left': pos.y
                    })
                }
            }
        }
        if (data.room.turn == player.getColor())
            $('.btn-dark').removeAttr('disabled');
        else
            $('.btn-dark').attr('disabled', 'disabled');
    }
    updateDice(data) {
        if (data.code == status.ACCEPT)
            $('.btn-dark').removeAttr('disabled');
        else
            $('.btn-dark').attr('disabled', 'disabled');
        $('.dice').text(data.room.dice);
    }
    beginGame(id, data) {
        for (let i in data.users) {
            if (data.users[i].id == id) {
                player.color = data.users[i].color;
                break;
            }
        }
        if (player.getColor() == data.turn)
            $('.btn-dark').removeAttr('disabled');
        else
            $('.btn-dark').attr('disabled', 'disabled');
    }
}