/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react';
import {io} from 'socket.io-client'
import {Button, Container, Stack, TextField, Typography} from "@mui/material"

const App = () => {
  const socket = useMemo(()=> io("http://localhost:3000"), []);
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  const [room ,setRoom] = useState("")
  const [socketId, setSocketId] = useState("")
  const [roomName, setRoomName] = useState("")




console.log(messages);
  const handleSubmit = (e) => {
    e.preventDefault();

    socket.emit("message", {message, room})
    setRoom("")

  }

  const joinRoomHanlder = (e) => {
    e.preventDefault();

    socket.emit("join-room", roomName)
  }

  useEffect(()=> {
    socket.on("connect", () => {
      setSocketId(socket.id)
      console.log("connected", socket.id);

      socket.on("receive-message", (data)=> {
        console.log(data);
        setMessages((messages) => [...messages, data])
      })

      socket.on("welcome", (s)=>{
        console.log(s);
      })
    });


    return () => {
      socket.disconnect()
    }

  },[]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h1" component="div" gutterBottom>
          Welcome to Socket.io
      </Typography>
      <Typography variant="h6" component="div" gutterBottom>
          {socketId}
      </Typography>

      <form onSubmit={joinRoomHanlder}>
        <h5>Join Room</h5>
        <TextField 
        value={roomName}
        onChange={(e)=> setRoomName(e.target.value)}
        id="outlined-basic" label="Room Name" variant='outlined' />

        <Button type="submit" variant="contained" color="primary"> Join</Button>
      </form>





      <form onSubmit={handleSubmit}>
        <TextField 
        value={message}
        onChange={(e)=> setMessage(e.target.value)}
        id="outlined-basic" label="Message" variant='outlined' />
        <TextField 
        value={room}
        onChange={(e)=> setRoom(e.target.value)}
        id="outlined-basic" label="Room" variant='outlined' />
        <Button type="submit" variant="contained" color="primary"> Send</Button>
      </form>

      <Stack>
        {messages.map((m,i) => 
            <Typography key={i} variant="h6" component="div" gutterBottom>
          {m}
            </Typography>
          )
        }
      </Stack>

    </Container>
  )
}

export default App


