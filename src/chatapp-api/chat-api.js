

export const fetchFriends = async (API_BASE_URL) => {
    const response = await fetch(`${API_BASE_URL}/friends/load`, { credentials: "include" });
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
    const text = await response.text();
    return { ok: response.ok, status: response.status, data: text };
}

export const acceptFriendRequest = async (API_BASE_URL, friend_id) => {
    const response = await fetch(`${API_BASE_URL}/friends/accept?friendId=${friend_id}`, {
        method: "POST",
        credentials: "include",
    });
    const text = await response.text();
    return { ok: response.ok, status: response.status, data: text };
}

export const rejectFriendRequest = async (API_BASE_URL, friend_id) => {
    const response = await fetch(`${API_BASE_URL}/friends/reject?friendId=${friend_id}`, {
        method: "POST",
        credentials: "include",
    });
    const text = await response.text();
    return { ok: response.ok, status: response.status, data: text };
}

export const createOrFetchConversation = async (API_BASE_URL, friendId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/conversations/private?friendId=${friendId}`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to get conversation");
        }

        const conversation = await response.json();
        return conversation; // Contains { id, name, isGroup, isPublic, createdAt }
    } catch (error) {
        console.error("❌ Error fetching/creating conversation:", error);
        return null;
    }
};

export const fetchPrivateMessages = async (API_BASE_URL, conversationId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/messages/private/${conversationId}`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to get messages");
        }

        const messages = await response.json();
        return messages; // Array of message objects
    } catch (error) {
        console.error("❌ Error fetching private messages:", error);
        return [];
    }
};

export const fetchPublicMessages = async (API_BASE_URL) => {
    const response = await fetch(`${API_BASE_URL}/messages/public`);
    const data = await response.json();
    return data;
};

export const uploadProfilePic = async (file, API_BASE_URL) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/profile/upload`,
        {
            method: "POST",
            credentials: "include",
            body: formData,
        });

    const imageUrl = await response.text();
    return imageUrl;
};

export const updateProfilePic = async (file, API_BASE_URL) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/profile/update`, {
        method: "PUT",
        credentials: "include",
        body: formData,
    });

    const imageUrl = await response.text();
    return imageUrl;
};

export const deleteProfilePic = async (API_BASE_URL) => {
    const response = await fetch(`${API_BASE_URL}/profile/delete`, {
        method: "DELETE",
        credentials: "include",
    });

    const result = await response.text();
    return result;
};

//fetch current user information is handled by authProvider