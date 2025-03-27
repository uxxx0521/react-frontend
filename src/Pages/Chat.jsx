import { useState, useEffect, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import "./Chat.css"
import { AuthContext } from '../context/AuthContext';
import { fetchPublicMessages, fetchPrivateMessage, fetchFriends, sendFriendRequest, fetchIncomingRequests } from '../chatapp-api/chat-api';

function Chat() {
    const mockFriends = ["a", "b", "c"]; // mock friends
    const [friends, setFriends] = useState([]);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const navigate = useNavigate();
    const { user, setUser, refreshUser } = useContext(AuthContext);
    const [friendInput, setFriendInput] = useState("");
    const isGuest = !user;
    const [showRequests, setShowRequests] = useState(false);
    const [incomingRequests, setIncomingRequests] = useState([]);

    // 
    const API_BASE_URL = "http://localhost:8080/chatapi/api";
    //const WS_BASE_URL = "wss://chenliudev.com/ws";          // Use "wss://" for WebSocket over HTTPS
    const WS_BASE_URL = "ws://localhost:8080/ws";

    const handleShowRequests = async () => {
        if (!showRequests) {
            // Only fetch when opening
            const data = await fetchIncomingRequests(API_BASE_URL);
            setIncomingRequests(data);
        }

        setShowRequests(!showRequests); // toggle popup
    };

    const loadMessages = async () => {
        try {
            const data = await fetchPublicMessages(API_BASE_URL);
            if (Array.isArray(data)) {
                setMessages(data);
            } else {
                console.error("Unexpected data format:", data);
                setMessages([]);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            setMessages([]);
        }
    };

    const loadFriends = async () => {

        try {
            const data = await fetchFriends(API_BASE_URL);  // getting an array of friend objects
            setFriends(data);
        } catch (error) {
            console.error("Error fetching friends:", error);
            setFriends([]);
        }
    }

    useEffect(() => {
        let client;

        const connect = () => {
            client = new Client({
                brokerURL: WS_BASE_URL, //  WebSocket URL of your backend
                debug: (str) => console.log("[STOMP DEBUG]:", str), //  Add debugging logs
                reconnectDelay: 5000, //  Auto-reconnect every 5s
                onConnect: () => {
                    console.log("Connected to WebSocket ");

                    // Subscribe to public chat
                    client.subscribe("/topic/public", (message) => {
                        try {
                            const newMessage = JSON.parse(message.body);
                            setMessages((prev) => [...prev, newMessage]);
                        } catch (error) {
                            console.error(" Error parsing WebSocket message:", error);
                        }
                    });
                },
                onStompError: (frame) => {
                    console.error(" WebSocket STOMP Error:", frame);
                },
                onWebSocketError: (error) => {
                    console.error(" WebSocket Connection Error:", error);
                }
            });

            client.activate();
            setStompClient(client);
        };

        connect();
        loadMessages();


        return () => {
            if (client) {
                client.deactivate();
                setStompClient(null);
                console.log("WebSocket Disconnected!");
            }
        };
    }, []);

    useEffect(() => {
        if (user) {
            console.log("✅ user loaded, fetching friends...");
            loadFriends();
        }
    }, [user]);


    const sendMessage = () => {
        if (stompClient && stompClient.connected && text.trim() !== "") {
            const chatMessage = { sender: "User", content: text };

            console.log("Sending Message:", chatMessage);

            stompClient.publish({
                destination: "/app/chat.send", // backend MessageMapping
                body: JSON.stringify(chatMessage),
            });
            setText(""); // Clear input field
        } else {
            console.error("STOMP client is not connected yet!");
        }
    };

    const handleFriendRequest = async () => {
        try {
            const result = await sendFriendRequest(API_BASE_URL, friendInput);

            if (result.ok) {
                alert("✅ Friend request sent!")
            } else {
                alert(`❌ Failed to send request: ${result.data}`);
            }


        } catch (error) {
            console.error("something's wrong during sending friend request:", error);
        }

        setFriendInput("");
    };



    return (
        <>
            <div className="chat-app-container">
                <div className="app-container">
                    <button className='chat-app-go-back-button' onClick={() => navigate("/portfolio")}> ←</button>
                    {/* Title */}
                    <h1 className="chat-title">Let's Chat!!!</h1>

                    {/* Profile Section */}
                    <div className="profile-container">
                        <div className="profile-pic">
                            <p>Pic</p>
                        </div>
                        <div className="profile-name">User</div>
                        <div className='profiole-button'>
                            <button className='send-button' onClick={() => navigate("/portfolio/chat/sign_in")} >Sign in</button>
                            <button className='send-button' onClick={() => navigate("/portfolio/chat/sign_up")}>Sign up</button>
                        </div>
                    </div>

                    {/* Main Content (Friends List + Chat) */}
                    <div className="main-content">

                        {/* Friends List (Left Side) */}
                        <div className="friend-container">
                            <h2 className='friend-container-title'>Friends</h2>
                            <ul>
                                {friends.map((friend, index) => (
                                    <li key={index}>{friend.username}</li>
                                ))}
                            </ul>
                            <input
                                className="friend-search-input"
                                placeholder="Enter username"
                                value={friendInput}
                                onChange={(e) => setFriendInput(e.target.value)}>
                            </input>
                            <button className="friend-request-button" onClick={handleFriendRequest}>Send Request</button>
                            <button onClick={handleShowRequests}>Request received</button>
                            {showRequests && (
                                <div className="popup-modal">
                                    <h3>Pending Friend Requests</h3>
                                    {incomingRequests.length === 0 ? (
                                        <p>No requests</p>
                                    ) : (
                                        <ul>
                                            {incomingRequests.map((req, i) => (
                                                <li key={i} className="request-item">
                                                    <span>{req.username}</span>
                                                    <div className="request-actions">
                                                        <button
                                                            onClick={() => handleAcceptRequest(req.id)}
                                                            className="accept-btn"
                                                        >
                                                            ✓
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectRequest(req.id)}
                                                            className="reject-btn"
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <button onClick={() => setShowRequests(false)}>Close</button>
                                </div>
                            )}
                        </div>

                        {/* Chat Section (Right Side) */}
                        <div className="chat-container">
                            <div className="chat-display">
                                <h2 className='main-content-title'>Chat</h2>
                                {messages.map((msg, index) => (
                                    <div key={index}>
                                        <strong>{msg.sender}:</strong> {msg.content}
                                    </div>
                                ))}
                            </div>
                            <div className="input-container">
                                <input
                                    className="input-box"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Type your message..."
                                />
                                <button className="send-button" onClick={sendMessage}>Send</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );

}

export default Chat;
