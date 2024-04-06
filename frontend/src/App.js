import logo from './logo.svg';
import './App.css';
import socketIOClient from "socket.io-client";
import React, { useEffect } from 'react';

const ENDPOINT = "http://localhost:3000";

function App() {
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("events", { data: "Hello Server!" });
    });

    // cleanup the effect
    return () => socket.disconnect();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React One !
        </a>
      </header>
    </div>
  );
}

export default App;
