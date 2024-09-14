const express = require('express');
const path = require('path');
const usersRouter = require('./usersRouter');

const app = express();
const port = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, '/Build')));

app.use(`/users`, usersRouter);

app.get('/webgl', (req, res) => {
    res.sendFile(path.join(__dirname, 'Build', 'index.html'));
  });

app.listen(port, ()=>
{
   console.log(`SERVER 실행됨 ${port}`); 
});
// node app.js
//http://127.0.0.1:3000