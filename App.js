const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const dbConfig = require('./config/database');
const usersRouter = require('./usersRouter'); // usersRouter 임포트

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json()); // JSON 파싱을 위해 추가

// usersRouter 설정
app.use('/users', usersRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'view.html'));
});

app.get('/api/data', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [students] = await connection.execute('SELECT * FROM student');
        const [lines] = await connection.execute('SELECT * FROM line');
        res.json({ students, lines });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    } finally {
        await connection.end();
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// node app.js (터미널에서 이 코드로 실행)
//http://127.0.0.1:3000