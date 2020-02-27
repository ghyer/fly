var step = {}
var people_cnt = null;

const JOIN = 1;
const COLOR = 2;
const MAIN = 3;
const RED_NO = 1;
const BLUE_NO = 2;
const GREEN_NO = 4;
const YELLOW_NO = 8;

const status = {
    ACCEPT: 100,
    BEGIN: 107,
    ERROR_EMPTY: 101,
    ERROR_INPUT: 102,
    ERROR_ROOM_CNT: 103,
    ERROR_ROOM_BEGIN: 104,
    ERROR_ROOM_FULL: 105,
    ERROR_COLOR_AGAIN: 106,
    ERROR_COLOR_NUMBER: 108,
    ERROR_COLOR_CHOSEN: 111,
    ERROR_ROOM_IN: 109,
    ERROR_TURN: 110,
    ACCEPT_DICE_NEXTTURN: 112,
}