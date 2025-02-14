import React, { useEffect, useState } from "react";


const LoadingScreen = ({ onFinish }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setFadeOut(true);
            setTimeout(onFinish, 800); // Delays removal of loading screen
        }, 3000);
    }, [onFinish]);

    return (
        <div className={`loading-screen ${fadeOut ? "fade-out" : ""}`}>
            <div className="spinner"></div>
            <h2 className="loading-text">Welcome to My Portfolio!!! 😊🥳🎉🎉🎉</h2>
        </div>
    );
};

export default LoadingScreen;
