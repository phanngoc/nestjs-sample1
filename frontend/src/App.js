import './App.scss';
import socketIOClient from "socket.io-client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { postThread, getOrSetFromLocalStorage } from './service';

const ENDPOINT = "http://localhost:3000";

function App() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [threadId, setThreadId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isCreateThread, setIsCreateThread] = useState(false);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    setSocket(socket);

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("events", { data: "Hello Server!" });
    });

    socket.on('message', (data) => {
      console.log('Received message:', data);
      setMessages(prevMessages => [...prevMessages, data]);
    });

    // cleanup the effect
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const threadId = getOrSetFromLocalStorage('threadId');
    setThreadId(threadId);

    const userId = getOrSetFromLocalStorage('userId');
    setUserId(userId);
    

    if (!isCreateThread && threadId !== null && userId !== null) {
      console.log('Posting thread:', threadId, userId);
      const fetchData = async () => {
        let thread = await postThread(threadId, userId);
        console.log('Thread:', thread);
        const responseMessages = await axios.get(ENDPOINT + '/api/messages',
          {
            params: {
              threadId: threadId
            }
          });
        console.log('responseMessages:', responseMessages);
      }
      fetchData();
      setIsCreateThread(true);
    }

    if (socket) {
      console.log('Emit:Joining thread', threadId);
      socket.emit('joinThread', threadId);
    }
  }, [socket]);

  const sendMessage = () => {
    if (socket) {
      socket.emit('message', message);
      setMessage("");
    }
  };

  return (
    <div className="App">
      <div className="wrap-messages">
        <div className='messages'>
          {messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
      </div>
      <div id="wrap-input">
        <div id="wrap-message-control">
          <input value={message} onChange={(e) => setMessage(e.target.value)} name="input-message" />
        </div>
        <button onClick={sendMessage} id="btn-send">Send</button>
      </div>
    </div>
  );
}

export default App;
