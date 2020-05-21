const socket = io();
socket.on('connect', () => {
    console.log('connect!!');
    socket.emit('message', {abc: 'abc'});
});
