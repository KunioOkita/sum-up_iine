/**
 * エントリポイント
 */

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = 8118

app.use(express.static('public'));



/**
 * socket.io 処理
 */
io.on('connection',function(socket) {
    console.log('connected');
    // click iine button.
    socket.on('iine', (msg) => {
        // count up.
        console.log('iine!');
    });

    // clear iine.
    socket.on('clear_iine',function(msg){
        // clear iine
        console.log('message: ' + JSON.stringify(msg));
    });
});

http.listen(PORT, function(){
    console.log('server listening. Port:' + PORT);
});