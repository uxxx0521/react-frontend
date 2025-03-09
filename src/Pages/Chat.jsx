import { useState, useEffect } from 'react'
import { Client } from "@stomp/stompjs";
import "./Chat.css"

function Chat() {
    const friends = ["a", "b", "c"]; // mock friends
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        let client;

        const connect = () => {
            client = new Client({
                brokerURL: "ws://localhost:8080/ws", //  WebSocket URL of your backend
                onConnect: () => {
                    console.log("Connected to WebSocket ");

                    // Subscribe to public chat
                    client.subscribe("/topic/public", (message) => {
                        const newMessage = JSON.parse(message.body);
                        setMessages((prev) => [...prev, newMessage]);
                    });
                },
                onDisconnect: () => {
                    console.warn("WebSocket disconnected! Reconnecting...");
                    setTimeout(connect, 5000);
                },
                reconnectDelay: 5000, // Auto-reconnect every 5s
            });

            client.activate();
            setStompClient(client);
        };

        connect();
        fetchMessages();

        return () => {
            if (client) {
                client.deactivate();
                setStompClient(null);
            }
        };
    }, []);

    // Fetch chat history when the app loads
    const fetchMessages = async () => {
        try {
            const response = await fetch("http://localhost:8080/chatapi/messages"); // Backend API
            const data = await response.json();

            // Ensure data is an array before setting state
            if (Array.isArray(data)) {
                setMessages(data);
            } else {
                console.error("Unexpected data format:", data);
                setMessages([]); // Fallback to empty array
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            setMessages([]); // Fallback to empty array in case of an error
        }
    };


    const sendMessage = () => {
        if (stompClient && stompClient.connected && text.trim() !== "") {
            const chatMessage = { sender: "User", content: text };
            stompClient.publish({
                destination: "/app/chat.send", //  Must match the backend MessageMapping
                body: JSON.stringify(chatMessage),
            });
            setText(""); // Clear input field
        } else {
            console.error("STOMP client is not connected yet!");
        }
    };




    return (
        <>
            <div className="chat-app-container">
                <div className='app-container'>

                    <h1>Lets Chat!!!</h1>
                    <div className="profile-container">
                        <div>
                            my pic
                        </div>
                        <div>my name</div>
                    </div>
                    <div className="friend-container">
                        <h2>Friends</h2>
                        <ul>
                            {friends.map((friend, index) => (
                                <li key={index}> {friend}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="chat-container">
                        <div className='chat-content'>
                            <div className="chat-display">
                                <h2>Chat</h2>
                                {messages.map((msg, index) => (
                                    <div key={index}>
                                        <strong>{msg.sender}:</strong> {msg.content}
                                    </div>
                                ))}
                            </div>
                            <div className="input-container">
                                <input className="input-box" value={text} onChange={(e) => setText(e.target.value)}
                                    placeholder="Type your message...">

                                </input>
                                <button className="send-button" onClick={sendMessage}>Send</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>




        </>
    )
}

export default Chat
