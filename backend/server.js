const express = require('express')
const { chats } = require('./data/data')
const dotenv = require('dotenv')
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require("./routes/messageRoutes")
const path  = require("path")
dotenv.config()
app.use(cors({origin: 'https://securechatmern.netlify.app'}));
const connectDB = require('./config/db')
const { notFound, errorHandlers } = require("./middleware/errorMiddleware")
const { Socket } = require('socket.io')
var app = express()
connectDB()
app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
    res.send("API is Running")
})

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

// Deployment

// const __dirname1 = path.resolve()


// Deployment

app.use(notFound)
app.use(errorHandlers)

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, console.log(`Server listening on port ${PORT}....`))

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "https://securechatbackend.onrender.com",

    },
})

io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat",(room)=>{
        socket.join(room)
        console.log("user joined room" + room)
    })

    socket.on("typing",(room)=>socket.in(room).emit("typing"))
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"))

    socket.on("newMessage",(newMessageRecieved)=>{
        var chat = newMessageRecieved.chat
        if(!chat.users) console.log("chat.user not defined")
        chat.users.forEach(user=>{
            if(user._id == newMessageRecieved.sender._id) return
            socket.in(user._id).emit('message Recieved',newMessageRecieved)
        })
    })
    socket.off('setup',()=>{
        console.log("User Disconnected")
        socket.leave(userData._id)
    })
})