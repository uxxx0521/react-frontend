import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const refreshUser = async () => {
        try {
            const res = await fetch("http://localhost:8080/chatapi/api/auth/me", {
                credentials: "include",
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setUser(data.user);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        refreshUser(); // runs once on mount
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};