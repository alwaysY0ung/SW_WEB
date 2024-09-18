const express = require('express');
const path = require('path');
const cors = require('cors');
const usersRouter = require('./usersRouter');

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default to 3000

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, '/Build')));
app.use(express.static(path.join(__dirname, '/public')));

app.use(`/users`, usersRouter);

app.get('/webgl', (req, res) => {
    res.sendFile(path.join(__dirname, 'Build', 'index.html'));
});

app.get('/manage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'manage.html'));
});

app.listen(port, () => {
    console.log(`SERVER 실행됨 ${port}`);
});
// node app.js (터미널에서 이 코드로 실행)
//http://127.0.0.1:3000