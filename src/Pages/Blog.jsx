function Blog() {
  return (
    <>
      <div className="blog-page">
        <header className="blog-header">
          <h1>Building a Full-Stack Expense Tracker: Challenges & Lessons Learned</h1>
          <p className="blog-date">Published on February 15, 2025</p>
        </header>

        <article className="blog-content">
          <p>
            Managing personal finances can be tricky, so I built a full-stack Expense Tracker using React, Express, and PostgreSQL.
            This blog explores the development process, the challenges I faced, and how I optimized the app for real-world use.
          </p>

          <h2>Technology Used</h2>
          <ul style={{ marginBottom: "5px", lineHeight: "1.6" }}>
            <li>Front-end: React, Vite</li>
            <li>Back-end: Express.js, Nginx, JWT</li>
            <li>Deployment: Docker, AWS(EC2)</ li>
          </ul>

          <h2>Key Features</h2>
          <ul>
            <li>💰 User Authentication (JWT-based login & signup)</li>
            <li>📊 Live Stock data (finnhubAPI free tier)</li>
            <li>☁️ Cloud Deployment (AWS EC2)</li>
            <li>🚀 NginX Optimization</ li>
          </ul>


          <h2>Challenges & Solutions</h2>
          <p>
            Front-end:
          </p>
          <ul style={{ marginBottom: "5px", lineHeight: "1.4" }}>
            <li>
              1) When I build welcome loading page, the loading page always renders when I visit the homepage. To solve this I
              used a flag "visited" to session storage, so user sees loading page only when they close the tab.
            </li>
            <li>
              2) Using a clean react router is crucial. One time I messed up with router and I coudn't easily
              find which router is going to which page.
            </li>
            <li>
              3) Maintaing clean components is also important. I had multiple components that has similar name and in different folder,
              it took long time to find the right component. Name the componenents distinguishable name and keep all the components
              in one parent folder can make things a lot easier.
            </li>
          </ul>
          <p>
            Back-end:
          </p>
          <ul style={{ marginBottom: "5px", lineHeight: "1.4" }}>
            <li>
              1) Handling JWT expiration & refresh tokens: Initially, when a user’s JWT expired, they had to **log in again manually**.
              To improve user experience, I implemented a **refresh token system**, automatically renewing access tokens without re-authentication.
            </li>
            <li>
              2) When I test my Application on the cloud EC2 server, somehow the back-end server doesn't send coockie to the front-end.
              I realized that the browser is blocking the cookie because I was still on HTTP protocol not HTTPS due to low security.
              this leads to me to change my Nginx.conf file to redirect from HTTP port 80 to https port 443  and get a SSL certificate for the EC2 to make my application run on
              HTTPS.
            </li>
            <li>
              3) After I redirect to HTTPS, for some reason I couldn't even access the https website. Turns out it was because I didn't have SSL certificate inside docker image. What
              a stupid mistake:(
            </li>
            <li>
              4) When I was trying to build each users their own main page for the tracker app, I was wondering how to identify each user. If there are thousands of users I can not make thousands different API routes.
              I figured it out by reconizing users by theire JWT token, server can extract username from the token so can send right data to the right user. So this way I don't need to create routes I can handle with a single
              route with different JWT token.
            </li>
          </ul >
          <p>Deployment:</p>
          <ul style={{ marginBottom: "5px", lineHeight: "1.4" }}>
            <li>
              1) EC2 crashes: EC2 crashes every couple hours for some reason. I checked the AWS matric there was a CPU utilization spike at the time of crash.
              I suspect it was due to low free memory since I'm using the EC2 free tier. I set up alarm and action on AWS to send me SNS
              alarm and reboot the EC2 instance if it crashes again. I also modified docker-compose.yml file to restart the docker when ever the instance reboots.
            </li>

          </ul>
          <p>Maintenance:</p>
          <ul>
            <li>
              1) DB crashes: I noticed that DB stops working after I run the container for couple hours. I suspect it is due to low memery(1GB) on EC2 so I decided to lower the usage of DB.
              I did it by mount a cnf file to the container lower the caching that DB uses. I believe in my case lowering cache doesn't cause any disadvantage because I have very few simultaneous users.
              After I lowered memory usage of DB it uses 10% less memory than before which is great.
            </li>
            <li>
              2) DB crashes again. I coudn't find any error even from the docker container logs. I decided to restart container every 3hrs using crontab for now.
              Still working on to fix this issue.
            </li>
          </ul>

          <p>Link to my documentation: </p>
          <ul style={{ marginBottom: "5px", lineHeight: "1.4" }}>
            <li>
              Docker:&nbsp;
              <a href="https://docs.google.com/document/d/18R2g6h7AWsqZX8bUb1wj1xrscN-8yZ6LNSK3VcpGk1o/edit?tab=t.0"
                target="_blank"
                rel="noopener noreferrer">
                https://docs.google.com/document/d/18R2g6h7AWsqZX8bUb1wj1xrscN-8yZ6LNSK3VcpGk1o/edit?tab=t.0
              </a>
            </li>
            <li>
              JWT:&nbsp;
              <a href="https://docs.google.com/document/d/1RD-xKWZGjApKYs2T6FvcWqX2HxarC1aoyc5O2icCxgg/edit?tab=t.0"
                target="_blank"
                rel="noopener noreferrer">
                https://docs.google.com/document/d/1RD-xKWZGjApKYs2T6FvcWqX2HxarC1aoyc5O2icCxgg/edit?tab=t.0
              </a>
            </li>
            <li>
              MySQL:&nbsp;
              <a href="https://docs.google.com/document/d/12cX9Sb5OQcmbidk6Z6uEADtpfj_ArVfKp91I5xxqjUE/edit?tab=t.0"
                target="_blank"
                rel="noopener noreferrer">
                https://docs.google.com/document/d/12cX9Sb5OQcmbidk6Z6uEADtpfj_ArVfKp91I5xxqjUE/edit?tab=t.0
              </a>
            </li>
            <li>
              Nginx&CORS:&nbsp;
              <a href="https://docs.google.com/document/d/1M7fZzcBMEZ2chS2dwxA72_VvxQT27CTBj2FpAHkG7Oc/edit?tab=t.0"
                target="_blank"
                rel="noopener noreferrer">
                https://docs.google.com/document/d/1M7fZzcBMEZ2chS2dwxA72_VvxQT27CTBj2FpAHkG7Oc/edit?tab=t.0
              </a>
            </li>

          </ul>
          <p>
            Summary: This project was a valuable learning experience in handling authentication, cloud deployment, and performance optimization.
            I plan to further enhance it by adding a CI/CD pipeline and auto-scaling for better reliability.
            Feel free to check out my documentation or reach out for any feedback!
          </p>


        </article>
      </div >
    </>
  );
}

export default Blog;



