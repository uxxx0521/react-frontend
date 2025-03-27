import React from "react";

const skills = [
    "React.js",
    "Node.js",
    "Express.js",
    "Spring Boot",
    "Java",
    "JavaScript",
    "Python",
    "C++",
    "SQL",
    "Git & GitHub",
    "Docker",
    "AWS"
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
