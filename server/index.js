const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const cors = require('cors')
const io = require('socket.io')(8080, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true // if you're using cookies or sessions
    }
});

// socket.io
let users = [];
io.on('connection', socket => {
    console.log("User Connected", socket.id);
    socket.on('addUser', userId => {
        const isUserExist = users.find(user => user.userId === userId);
        if (!isUserExist) {
            const user = { userId, socketId: socket.id };
            users.push(user);
            io.emit('getUsers', users);
        }
    });

    socket.on('sendMessage', async ({ senderId, receiverId, message, conversationId }) => {
        const receiver = users.find(user => user.userId === receiverId);
        const sender = users.find(user => user.userId === senderId);
        const user = await User.findById(senderId);
        if (receiver) {
            // const timestamp = Date.now();
            io.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
                senderId, message, conversationId, receiverId,
                user: { id: user._id, fullName: user.fullName, email: user.email },
                // timestamp: timestamp
            });
        } else {
            io.to(sender.socketId).emit('getMessage', {
                senderId, message, conversationId, receiverId,
                user: { id: user._id, fullName: user.fullName, email: user.email },
                // timestamp: timestamp
            });
        }
    });

    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id);
        io.emit('getUsers', users);
    })
});

const db = require('./config/mongoose')
const User = require('./models/user');
const { Socket } = require('socket.io');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/', require('./routes'));


app.listen(port, (err) => {
    if (err) {
        console.log("Error to listen the server", err);
    }

    console.log(`Server is running http://localhost:${port}`);

})
