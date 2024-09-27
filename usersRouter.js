const express = require('express');
const router = express.Router();
// const db = require('./config/database');  // 이게 아님요 ㅜㅜ 내가 하면서 getLine을 config/database.js로 따로 빼면서 DB관리하는 게 두개로 분리되어버림
const usersDBC = require('./usersDBC'); // 여튼 getLine이 있는 얘를 가져와야함

router.get('/getUsers', async (req, res) => {
    try {
        const lines = await usersDBC.getLine();
        const formattedData = lines.map(line => ({
            Time: line.Time,
            WaitingNumber: line.WaitingNumber,
            WaitingSpot: line.WaitingSpot,
            Major: line.Major,
            ID: line.ID,  // 학번
            Name: line.Name,
            Receipt: line.ReceiptConfirmation  // 추가
        }));
        console.log("usersRouter's response: ",(formattedData) )
        res.json(formattedData);  // 응답 보내기
    } catch (err) {
        console.error('Error in /getUsers route:', err);
        res.status(500).json({ message: err.message });
    }
});

// 새로운 학생 추가
router.post('/student', async (req, res) => {
    const { ID, Name, Major } = req.body;
    try {
        const result = await usersDBC.insertStudent([ID, Name, Major]);
        res.status(201).json({ message: '학생이 성공적으로 추가되었습니다.', id: result.insertId });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 대기열에 학생 추가
router.post('/line', async (req, res) => {
    const { ID, Time, WaitingNumber, WaitingSpot } = req.body;
    try {
        const result = await usersDBC.insertLine([ID, Time, WaitingNumber, WaitingSpot, null]);
        res.status(201).json({ message: '대기열에 학생이 성공적으로 추가되었습니다.', id: result.insertId });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 학생 정보 업데이트
router.put('/student/:ID', async (req, res) => {
    const { ID } = req.params;
    const { Name, Major } = req.body;
    try {
        await usersDBC.updateStudent(ID, [Name, Major]);
        res.json({ message: '학생 정보가 성공적으로 업데이트되었습니다.' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 대기 상태 업데이트 (Received)
router.put('/line/:ID/received', async (req, res) => {
    const { ID } = req.params;
    try {
        await usersDBC.updateReceipt(ID, 'Received');
        res.json({ message: '대기 상태가 "받음"으로 업데이트되었습니다.' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 대기 상태 업데이트 (NotReceived)
router.put('/line/:ID/notreceived', async (req, res) => {
    const { ID } = req.params;
    try {
        await usersDBC.updateReceipt(ID, 'NotReceived');
        res.json({ message: '대기 상태가 "받지 않음"으로 업데이트되었습니다.' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 대기 위치 업데이트
router.put('/line/:ID/spot', async (req, res) => {
    const { ID } = req.params;
    const { WaitingSpot } = req.body;
    try {
        await usersDBC.updateWaitingSpot(ID, WaitingSpot);
        res.json({ message: '대기 위치가 성공적으로 업데이트되었습니다.' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 학생 삭제
router.delete('/student/:ID', async (req, res) => {
    const { ID } = req.params;
    try {
        await usersDBC.deleteStudent(ID);
        res.json({ message: '학생이 성공적으로 삭제되었습니다.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 대기열에서 학생 제거
router.delete('/line/:ID', async (req, res) => {
    const { ID } = req.params;
    try {
        await usersDBC.deleteLine(ID);
        res.json({ message: '대기열에서 학생이 성공적으로 제거되었습니다.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 대기 상태 업데이트 (Received)
router.put('/line/:ID/received', async (req, res) => {
    const { ID } = req.params;
    try {
        await usersDBC.Received(ID);
        res.json({ message: '대기 상태가 "받음"으로 업데이트되었습니다.' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 대기 상태 업데이트 (NotReceived)
router.put('/line/:ID/notreceived', async (req, res) => {
    const { ID } = req.params;
    try {
        await usersDBC.NotReceived(ID);
        res.json({ message: '대기 상태가 "받지 않음"으로 업데이트되었습니다.' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/line/:ID/notArrived', async (req, res) => {
    try {
        await usersDBC.markAsNotArrived(req.body.NUID);
        res.json({ success: true });
    } catch (error) {
        console.error('Error marking as not arrived:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;