const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors')
const { addUsers, removeUsers, getUsers } = require('./users');

const router = require('./router');
const { callbackify } = require('util');
const { use } = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on('connection', (socket) => {
    console.log('We have a new socket connection...');

    socket.on('join', ({ name, room }, callback) => {
        // console.log('on join',name, room);
        const {error, user} = addUsers({ id : socket.id, name, room });

        if(error) return callback(error);

        socket.join(user.room);

        socket.emit('adminMessage', {user : 'admin', text : `${user.name}, Welcome to ${user.room}`});
        //Sends message to all sockets except the original emitter
        socket.broadcast.to(user.room).emit('adminMessage', {user : 'admin', text : `${user.name} has joined the room`});
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUsers(socket.id);
        //Sends message to all sockets including emitter
        io.to(user.room).emit('adminMessage', {user : user.name, text : message});
        callback();
    })

    socket.on('disconnect', () => {
        console.log('This socket / user left the chat...')
        const user = removeUsers(socket.id);

        if(user) {
            socket.broadcast.to(user.room).emit('adminMessage', {user : 'admin', text : `${user.name} has left.` });
        }
    })
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server has started on PORT ${PORT}`));