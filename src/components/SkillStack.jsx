import React from "react";

const skills = [
    "JavaScript",
    "React.js",
    "Node.js",
    "Express.js",
    "Python",
    "SQL",
    "Git & GitHub",
    "Docker",
    "AWS",
    "SSL",
];

const SkillStack = () => {
    return (
        <div className="skill-stack-container">
            <h2 className="skill-title">My Skill Stack</h2>
            <div className="skill-grid">
                {skills.map((skill, index) => (
                    <div key={index} className="skill-item">
                        {skill}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillStack;
