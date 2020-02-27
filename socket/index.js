const http = require('http');
const socket = require('socket.io');
const server = http.createServer();
const io = socket(server);

const fly = require('./fly/Input');
// 添加新项目在这里添加

// 开启端口
io.listen(3000);

// 运行飞行棋
new fly(io.of('/fly'));