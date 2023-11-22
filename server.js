const express = require('express')();
const http = require('http');
const server = http.createServer(express);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5173"
    }
});

server.listen(8080, () => {
    console.log('listening on *:8080');
});


io.on('connection', (socket) => {
    socket.on('send-message', (msg) => {
        io.emit('receive-message',msg)
    });
    socket.on('set-name',(name)=>{
        io.emit('receive-message',{
            name:'Admin',
            message:`${name} joined chat!`,
            id:Date.now()
        })
    });
    socket.on('user-left',(name=>{
        io.emit('receive-message',{
            name:'Admin',
            message:`${name} left chat!`,
            id:Date.now()
        })
    }))
});