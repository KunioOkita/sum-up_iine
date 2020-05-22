/**
 * エントリポイント
 */

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 8118;

app.use(express.static('public'));



/**
 * socket.io 処理
 */
const clientMap = new Map();
const controllerMap = new Map();
const countMap = new Map();
let countTarget = '';
io.on('connection',function(socket) {
    console.log('connected', socket.id);
    socket.on('disconnect', () => {
        console.log('disconnect');
        clientMap.delete(socket.id);
        controllerMap.delete(socket.id);
    });
    // click iine button.
    socket.on('iine', (msg) => {
        // count up.
        console.log('iine!');
        if (countTarget === '') {
            return;
        }
        countMap.set(countTarget, countMap.get(countTarget) + 1);
    });

    socket.on('client_type', (msg) => {
        switch(msg) {
            case 'iine_client':
            default:
                clientMap.set(socket.id, socket);
                break;
            case 'controller':
                controllerMap.set(socket.id, socket);
                break;
        }
        console.log(`client_count: ${clientMap.size}`);
        console.log(`controller_count: ${controllerMap.size}`);
    });

    // カウント対象を設定する
    socket.on('set_target', (msg) => {
        if (!countMap.has(msg)) {
            countMap.set(msg, 0);
        }
        countTarget = msg;
    });

    // clear iine.
    socket.on('clear_iine',function(msg){
        // clear iine
        countMap.clear();
    });
});

setInterval(() => {
    let countData = {};
    for (let [key, value] of countMap) {
        console.log(key + ' = ' + value);
        countData[key] = value;
    }

    for (let [id, socket] of controllerMap) {
        socket.emit('count_result', countData);
    }
}, 1000);

http.listen(PORT, function(){
    console.log('server listening. Port:' + PORT);
});
