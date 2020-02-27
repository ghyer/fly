socket = new Socket();
player = new Player();
game = new Game();
page = new Page();

function joinRoom() {
    let room = page.getVal('#room');
    let nick = page.getVal('#nickname');
    let peopleCnt = page.getPeopleCnt();
    let result = page.checkRoom(nick, room);
    if (result)
        player.joinRoom(nick, room, peopleCnt);
}

function chooseColor(color) {
    player.setColor(color);
}

function getDice() {
    player.getDice();
}

function choosePiece(piece, color) {
    player.choosePiece(color, piece);
}