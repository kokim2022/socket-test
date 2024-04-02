import { useState } from 'react'
import './App.css'
import { io } from 'socket.io-client'
import { useEffect } from "react";

function App() {
  const [socket, setSocket] = useState()
  const [messages, setMessages] = useState([])
  const [queueCallCount, setQueueCallCount] = useState()
  const [liveQueueCallStatus, setLiveQueueCallStatus] = useState([])

  useEffect(() => {
    const socketClient = io("https://ms.klink.cloud", {
      withCredentials: true, //need ,
      transports: ['websocket'],
    });
    setSocket(socketClient)
    socketClient?.on("connect", () => {
      console.log("socket connection ok");
    });
    // create socket room with email
    // socket?.emit("server:join", { email: authUser?.email, tenantId: authUser?.tenant_id });

    return () => {

    };
  }, []);
  useEffect(() => {
    socket?.on("connect", () => {
      console.log("socket connection ok");
    });

    socket?.emit("server:join", { email: 'waiyan@gmail.com', tenantId: '9b7d1811-8360-4d9e-a0ae-4c5ebe9ea29d' });
    socket?.emit("server:connectAgent", 'test');

    // create socket room with email
    // socket?.emit("server:join", { email: authUser?.email, tenantId: authUser?.tenant_id });
    socket?.on("client:newMessage", (newMessage) => {
      console.log("newMessage", newMessage);
      setMessages(current => [newMessage, ...current]);
    });

    socket?.on("client:liveQueueCallStatus", (liveQueueCallStatus) => {
      setLiveQueueCallStatus(liveQueueCallStatus);
    });

    socket?.on("client:newQueueCallCount", (newQueueCallCount) => {
      setQueueCallCount(newQueueCallCount);
    });
    

    const connectAgentPayload = {
      extensionId: "97",
      name: "Kuro",
      userId: "feefcc5c-6efa-42cf-b89a-cb7e7f134f2b",
      tenantId: "038ec0fe-9ea9-4050-8c77-67b802663f43",
      email: "kuro@demo.klink.cloud",
      agentStatus: "available",
      agentStatusId: "2267c2af-f8e0-4f7c-a588-adabd2c278d5"
    };
    socket?.emit("server:connectAgent", connectAgentPayload)
    return () => {

    };
  }, [socket]);
  return (
    <>
      {/* <h2>queueCallCount</h2> */}
      <pre>
        {JSON.stringify(messages.map(item => item.message), null, 4)}
      </pre>
    </>
  )
}

export default App
