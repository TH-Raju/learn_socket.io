import express from 'express';
import {Server} from 'socket.io';
import {createServer} from 'http';
import cors from 'cors';
import jwt from "jsonwebtoken";
import cookieParser from 'cookie-parser';

const port = 3000;
const app = express();
const secretKey = "thrajukhan"
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors({
    origin: "http://localhost:5173/",
    methods: ["GET", "POST"],
    credentials: true
}))

app.get("/", (req,res)=> {
    res.send("Hello Socket.io!")
})

app.get("/login", (req,res)=> {
    const token = jwt.sign({_id: "asdfajsldf"}, secretKey)

    res.cookie("token", token, {httpOnly: true, secure: true, sameSite: "none"})
    .json({
        message : "Login Success",
    })
})


io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, (err) => {
        if (err) return next(err)
        const token = socket.request.cookies.token;

        if(!token) return next(new Error("Authentication Error"))

        const decode = jwt.verify(token, secretKey);
        next()
    })
})

io.on("connection" ,(socket)=> {
    console.log("User Connected", socket.id);

    socket.on("message", ({room, message}) => {
        console.log(message);
        socket.to(room).emit("receive-message", message);
    })

    socket.on("join-room", (room)=> {
        socket.join(room)
        console.log(socket.id, " Joined ", room);
    })

    socket.on("disconnect", ()=> {
        console.log("User Disconnected!!!!");
    })

});

server.listen(port, ()=> {
    console.log(`Server is running on port ${port} ...`);
})