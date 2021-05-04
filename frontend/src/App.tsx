import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./App.css";
import uuid from "./utils/uuid";

function App() {
  const socket = useRef<any>(null);
  const user = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<any>([]);

  useEffect(() => {
    socket.current = io("localhost:8888");

    socket.current.on("id", (res: any) => {
      user.current = res;
    });

    socket.current.on("new-message", (res: any) => {
      setMessages((messages: any) => [...messages, { ...res, mId: uuid() }]);
    });
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNewMessage();
    }
  };

  const handleNewMessage = () => {
    if (!inputRef.current) return;
    const { value } = inputRef.current;
    if (!value) return;
    socket.current.emit("new-message", value);
    inputRef.current.value = "";
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat">
          <div className="chat__messages">
            {messages.map((message: any) => (
              <div
                key={message.mId}
                className={clsx(
                  "message",
                  message.id === user.current && "message--owner"
                )}
              >
                <p> {message.data}</p>
              </div>
            ))}
          </div>
          <div className="chat__input-container">
            <input
              type="text"
              ref={inputRef}
              placeholder="Input your message"
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleNewMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
