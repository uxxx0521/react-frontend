
const ResumeFile = () => {
    return (
        <div className="resume-container" style={{ textAlign: "center" }}>


            <iframe className="pdf-viewer"
                src="/resume_Chengzhe Liu.pdf"
                width="200%"
                height="800px"
                style={{ border: "none" }}
            ></iframe>

            <p>
                <a href="/resume_Chengzhe Liu.pdf" download className="download-link">
                    <button className="download-button">📄 Download</button>
                </a>
            </p>
        </div>
    );
};

export default ResumeFile;
