<h1>Task manager</h1>

<img src="./imgs/app view.JPG" alt="app-view-image">

<h2>How to run</h2>

<h3>🔷NOTE: You need Docker installed on your device to be able to run this application.</h3>
<br>
<p>Open the terminal inside any folder you want to install the app. Then Clone the repository into your machine</p>


```
git clone https://github.com/OmarAlmusa/Task-manager.git
```

<p>After that change the working directory to the newly created folder</p>

```
cd Task-manager
```

<p>Assuming you have already installed Docker, run the following command</p>

```
docker compose up -d
```

<p>The application will start, and it will appear running in your Docker GUI (Desktop application). You can navigate to the app by going into your browser and typing the following in the link bar</p>

```
localhost:3000
```

<p>you will see the task manager page, add some task by providing title and description (optional) and then click on "submit" button.</p>

<h3>🔷NOTE: if you face issues on the front page, (eg. tasks not appearing, or backendAPI returning empty tasks) then simply refresh the page. The issue can happen if you load into the "localhost:3000" quickly right after starting the app. Some seconds needed for the database to load.</h3>

<p>to stop the app, run the following command in terminal</p>

```
docker compose stop
```

<hr>

<h2>Motivation</h2>

<p>I created this simple project because I wanted to apply what I've learned so far in software development.</p>

<h4>Key things I've learned about</h4>
<ul>
    <li>Backend API development using FastAPI</li>
    <li>MongoDB and non-relational Databases</li>
    <li>Writing frontend using HTML/CSS/Javascript and how to connect it to the backend</li>
    <li>Docker and containerizing applications</li>
    <li>Implementing CI/CD pipeline using Github actions</li>
</ul>

<h4>Project roadmap</h4>
<ul>
    <li>Pulling MongoDB Docker container</li>
    <li>Connecting backend with MongoDB using pymongo</li>
    <li>Writing backend API using FastAPI python library</li>
    <li>Hosting frontend static pages using Express JS</li>
    <li>Writing frontend from scratch</li>
    <li>Writing tests for backend</li>
    <li>Containerizing my apps using Docker</li>
    <li>Using Docker Compose to run multi-container app</li>
    <li>Push the newly created container images to Docker Hub</li>
    <li>Implement CI/CD pipeline using Github actions</li>
</ul>