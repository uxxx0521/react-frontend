
export const fetchPublicMessages = async (API_BASE_URL) => {

    const response = await fetch(`${API_BASE_URL}/messages`);
    const data = await response.json();
    return data;
};


export const fetchFriends = async (API_BASE_URL) => {
    const response = await fetch(`${API_BASE_URL}/friends/load`, { credentials: "include" });
    const data = await response.json();
    return data;
}

export const fetchPrivateMessage = async (API_BASE_URL, friend_id) => {
    const response = await fetch(`${API_BASE_URL}/conversations/private?friendId=${friend_id}`, { credentials: "include" });
    const data = await response.json();
    return data;
}


export const fetchIncomingRequests = async (API_BASE_URL) => {
    const response = await fetch(`${API_BASE_URL}/friends/requests`, { credentials: "include" });
    const data = await response.json();
    return data;
}

export const sendFriendRequest = async (API_BASE_URL, username) => {
    const response = await fetch(`${API_BASE_URL}/friends/add?username=${username}`, {
        method: "POST",
        credentials: "include",
    });
    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
}
//fetch user information is handled by authProvider