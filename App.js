const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const dbConfig = require('./config/database');
const usersDBC = require('./usersDBC');  // usersDBC 모듈 추가

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const usersRouter = require('./usersRouter');

app.use('/Users', usersRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/manage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'manage.html'));
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

app.get('/api/queue', async (req, res) => {
    try {
        const queueData = await usersDBC.getLine();
        res.json(queueData);
    } catch (error) {
        console.error('Error fetching queue data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/received', async (req, res) => {
    try {
        await usersDBC.Received(req.body.NUID);
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating receipt status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/notReceived', async (req, res) => {
    try {
        await usersDBC.NotReceived(req.body.NUID);
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating receipt status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/notArrived', async (req, res) => {
    try {
        await usersDBC.markAsNotArrived(req.body.NUID);
        res.json({ success: true });
    } catch (error) {
        console.error('Error marking as not arrived:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});