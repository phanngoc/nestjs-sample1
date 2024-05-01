import './App.scss';
import React, { useEffect, useState, useReducer } from 'react';
import { initDataLoadpage, postMessage } from './service';
import Login from './components/Login';
// import './styles.css';
import {tasksReducer, initialState} from './reducers/tasksReducer';
import { receiveMessage } from './actions/login';

function useOnceCall(cb, condition = true) {
  const isCalledRef = React.useRef(false);

  React.useEffect(() => {
    if (condition && !isCalledRef.current) {
      isCalledRef.current = true;
      cb();
    }
  }, [cb, condition]);
}

function App() {
  const [message, setMessage] = useState("");

  const [data, dispatch] = useReducer(tasksReducer, initialState);

  let onConnect = () => {
    console.log("Connected to server");
    if (data.socket) {
      data.socket.emit("events", { data: "Hello Server!" });
    }
  };

  let onMessage = (data) => {
    console.log('Received message:', data);
    dispatch(receiveMessage(data));
  }

  useOnceCall(() => {
    console.log('Init data load page');
    initDataLoadpage({dispatch, onConnect, onMessage});
  });

  useEffect(() => {
    if (data.socket) {
      console.log('Socket:Joining thread');
      data.socket.emit('joinThread', {threadId: data.activeThreadId});
    }
  }, [data.socket]);

  const sendMessage = async () => {
    if (data.socket) {
      console.log('Sending message', message);
      // data.socket.emit('message', message);
      let messageCreated = await postMessage(message, data.activeThreadId);
      console.log('Message created', messageCreated);
      setMessage("");
    }
  };

  return (
    <div className="App">
      <div id="sidebar">
        <div id="main-threads">
          <div className="threads">
            <h3>Threads</h3>
            <ul>
              {data.threads.map((thread, index) => (
                <li key={index}>{thread.title}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div id="main-content">
        {!data.isLogin && <Login dispatch={dispatch} />}
        <div className="wrap-messages">
          <div className='messages'>
            {data.messages.map((message, index) => (
              <div key={index} className='message'>{message.content}</div>
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
    </div>
  );
}

export default App;
