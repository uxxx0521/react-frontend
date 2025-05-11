import { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import "./Chat.css"
import { AuthContext } from '../context/AuthContext';
import {
    fetchPublicMessages,
    fetchPrivateMessages,
    fetchFriends,
    sendFriendRequest,
    fetchIncomingRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    createOrFetchConversation,
    uploadProfilePic,
    updateProfilePic,
    deleteProfilePic
} from '../chatapp-api/chat-api';

function Chat() {
    const [friends, setFriends] = useState([]);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const navigate = useNavigate();
    const { user, setUser, refreshUser } = useContext(AuthContext);
    const [friendInput, setFriendInput] = useState("");
    const isGuest = !user;
    const [showRequests, setShowRequests] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [conversationTitle, setConversationTitle] = useState("Public Chat")
    const [currentConversationId, setCurrentConversationId] = useState(1)

    const subscriptionRef = useRef(null); // holds current active subscription
    const fileInputRef = useRef(null);

    //const API_BASE_URL = "http://localhost:8080/chatapi/api";         
    //const WS_BASE_URL = "ws://localhost:8080/ws";
    const API_BASE_URL = "https://chenliudev.com/chatapi/api";
    const WS_BASE_URL = "wss://chenliudev.com/ws";

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


    useEffect(() => {
        let client;

        const connect = () => {
            client = new Client({
                brokerURL: WS_BASE_URL,
                debug: (str) => console.log("[STOMP DEBUG]:", str),
                reconnectDelay: 5000,

                onConnect: () => {
                    console.log("✅ Connected to WebSocket");

                    // Subscribe to public chat once connected
                    const publicSub = client.subscribe("/topic/public", (message) => {
                        try {
                            const newMessage = JSON.parse(message.body);
                            setMessages((prev) => [...prev, newMessage]);
                        } catch (err) {
                            console.error("❌ Failed to parse public msg", err);
                        }
                    });

                    subscriptionRef.current = publicSub;
                },

                onStompError: (frame) => {
                    console.error("STOMP error:", frame);
                },
                onWebSocketError: (error) => {
                    console.error("WebSocket error:", error);
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
                console.log("🔌 WebSocket Disconnected!");
            }
        };
    }, []);

    useEffect(() => {
        if (user) {
            console.log(`✅ user ${user.username} loaded, fetching friends...`);
            loadFriends();
        }
    }, [user]);

    const sendMessage = () => {
        if (stompClient && stompClient.connected && text.trim() !== "") {
            const chatMessage = {
                message: text,
                senderId: user?.id || null,
                conversationId: currentConversationId
            };

            console.log("Sending Message:", chatMessage);

            stompClient.publish({
                destination: "/app/chat.send", // backend @MessageMapping
                body: JSON.stringify(chatMessage),
            });

            setText(""); // Clear input field
        } else {
            console.error("STOMP client is not connected yet!");
        }
    };


    const handleShowRequests = async () => {
        if (!showRequests) {
            // Only fetch when opening
            const data = await fetchIncomingRequests(API_BASE_URL);
            setIncomingRequests(data);
        }

        setShowRequests(!showRequests); // toggle popup
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

    const handleAcceptRequest = async (requesterId) => {
        try {
            const result = await acceptFriendRequest(API_BASE_URL, requesterId);
            if (result.ok) {
                alert("✅ Friend request accepted!")
                await loadFriends();
                await handleShowRequests();
            } else {
                alert(`❌ Failed to accept friend request: ${result.data}`);
            }

        } catch (error) {
            console.error("Error during accepting friend request:", error);
        }
    }

    const handleRejectRequest = async (requesterId) => {
        try {
            const result = await rejectFriendRequest(API_BASE_URL, requesterId);
            if (result.ok) {
                alert("✅ Friend request rejected!")
                await loadFriends();
                await handleShowRequests();
            } else {
                alert(`❌ Failed to reject friend request: ${result.data}`);
            }

        } catch (error) {
            console.error("Error during rejecting friend request:", error);
        }
    }

    const handleEnterPrivateChat = async (friendId) => {
        const conversation = await createOrFetchConversation(API_BASE_URL, friendId);
        if (conversation) {
            navigate(`/portfolio/chat/private/${conversation.id}`);
        }
    };

    const handleFriendClick = async (friendId, friendUsername) => {
        try {
            // 1. Fetch or create conversation
            const convo = await createOrFetchConversation(API_BASE_URL, friendId);

            if (!convo) {
                alert("❌ Failed to get or create conversation");
                return;
            }

            // 2. Fetch past messages
            const msgs = await fetchPrivateMessages(API_BASE_URL, convo.id);

            // 3. Unsubscribe from previous private topic if needed
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }

            // 4. Subscribe to the private conversation topic
            const newSubscription = stompClient.subscribe(
                `/topic/private.${convo.id}`,
                (message) => {
                    const newMsg = JSON.parse(message.body);
                    setMessages((prev) => [...prev, newMsg]);
                }
            );
            subscriptionRef.current = newSubscription;

            // 5. Update UI state
            setMessages(msgs);
            setConversationTitle("Private Chat: " + friendUsername);
            setCurrentConversationId(convo.id);

        } catch (error) {
            console.error("Error handling private chat: ", error);
        }
    };
    const handlePublicClick = async (conversationId) => {
        try {
            // 2. Fetch past messages
            const msgs = await fetchPublicMessages(API_BASE_URL);
            // 3. Unsubscribe from previous private topic if needed
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }
            // 4. Subscribe to the private conversation topic
            const newSubscription = stompClient.subscribe(
                `/topic/public`,
                (message) => {
                    const newMsg = JSON.parse(message.body);
                    setMessages((prev) => [...prev, newMsg]);
                }
            );
            subscriptionRef.current = newSubscription;
            // 5. Update UI state
            setMessages(msgs);
            setConversationTitle("Public Chat");
            setCurrentConversationId(conversationId);
        } catch (error) {
            console.error("Error handling public chat: ", error);
        }
    };

    const handleLogOut = async () => {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });

            setUser(null); // clear context
            setFriends([]); // clear friend list
            setCurrentConversationId(1);

        } catch (err) {
            console.error("Logout failed", err);
        }
    };
    const handleUploadPic = async (file) => {
        if (isGuest) {
            alert("Please login first!😊");
            return;
        }
        if (!isGuest && user?.profileImageUrl) {
            await handleUpdatePic(file);
            return;
        }
        try {
            const newImageUrl = await uploadProfilePic(file, API_BASE_URL);
            if (newImageUrl) {
                setUser(prev => ({
                    ...prev,
                    profileImageUrl: newImageUrl
                }));
                console.log("Profile pic updated:", newImageUrl);
            } else {
                throw new Error("Upload returned empty URL")
            }

        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    const handleUpdatePic = async (file) => {
        try {
            const newImageUrl = await updateProfilePic(file, API_BASE_URL);
            if (newImageUrl) {
                setUser(prev => ({
                    ...prev,
                    profileImageUrl: newImageUrl
                }));
                console.log("Profile pic updated:", newImageUrl);
            } else {
                throw new Error("Update returned empty URL")
            }
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    const handleDeletePic = async () => {
        if (isGuest) {
            alert("Please login first!😉")
            return;
        }
        if (!user?.profileImageUrl) {
            alert("No profile image to remove.😉")
        }
        try {
            const result = await deleteProfilePic(API_BASE_URL);
            console.log("Server responded:", result);
            setUser(prev => ({ ...prev, profileImageUrl: null }));
            console.log("Profile pic deleted.");
        } catch (error) {
            console.error("Error deleting pic:", error);
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleUploadPic(file);
        }
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
                        <div className="profile-pic" onClick={() => setShowDropdown(prev => (prev = !prev))} style={{ cursor: 'pointer' }} >
                            <img
                                src={user?.profileImageUrl || "/default-avatar.png"}
                                alt="Profile"
                                className="profile-img"
                            />
                        </div>
                        {showDropdown && (
                            <div className="dropdown-menu">
                                <div onClick={triggerFileInput}>Upload Pic</div>
                                <div onClick={handleDeletePic}>Delete Pic</div>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <div className="profile-name">
                            {user && (user.username)}
                            {!user && ("Guest")}
                        </div>
                        {isGuest && (
                            <div className='profiole-button'>
                                <button className='send-button' onClick={() => navigate("/portfolio/chat/sign_in")} >Sign in</button>
                                <button className='send-button' onClick={() => navigate("/portfolio/chat/sign_up")}>Sign up</button>
                            </div>
                        )}
                        {!isGuest && (
                            <div className='profiole-button'>
                                <button className='send-button' onClick={() => handleLogOut()} >Log out</button>
                            </div>
                        )}

                    </div>

                    {/* Main Content (Friends List + Chat) */}
                    <div className="main-content">

                        {/* Friends List (Left Side) */}

                        <div className="friend-container">
                            <h2 className='friend-container-title'>Friends</h2>

                            <ul>
                                <li onClick={() => handlePublicClick(1)}>
                                    Public chat room
                                </li>
                                {friends.map((friend, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleFriendClick(friend.id, friend.username)}
                                    >{friend.username}
                                    </li>
                                ))}
                            </ul>
                            {isGuest && (
                                <p>Login to add friends and chat 1:1!</p>
                            )}

                            {!isGuest && (
                                <>

                                    <div className="friend-request-container">
                                        <input
                                            className="friend-search-input"
                                            placeholder="Enter username"
                                            value={friendInput}
                                            onChange={(e) => setFriendInput(e.target.value)}
                                        />
                                        <button className="friend-request-button" onClick={handleFriendRequest}>
                                            Send Request
                                        </button>
                                        <button className="request-received-button" onClick={handleShowRequests}>Request received</button>
                                        {showRequests && (
                                            <div className="popup-modal">
                                                <h2>Pending Requests:</h2>
                                                {incomingRequests.length === 0 ? (
                                                    <p>No requests found</p>
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
                                                <button className="friend-request-close-button" onClick={() => setShowRequests(false)}>Close</button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                        </div>


                        {/* Chat Section (Right Side) */}
                        <div className="chat-container">
                            <div className="chat-display">
                                <h2 className='main-content-title'>{conversationTitle}</h2>
                                {messages.map((msg, index) => {
                                    let isMe = false;
                                    if (user) {
                                        isMe = msg.sender?.id === user.id
                                    }
                                    return (
                                        <div key={index} className={`message-bubble ${isMe ? "my-message" : "other-message"}`}>
                                            <strong>{msg.sender?.username || "Guest"}:</strong> {msg.message}
                                        </div>
                                    );
                                })}
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
