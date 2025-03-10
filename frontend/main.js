const express = require("express");
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'src')));

app.get("/config.js", (req, res)=>{
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    res.type('application/javascript');
    res.send(`window.CONFIG = { API_URL: "${backendUrl}" };`);
})

app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`)
})