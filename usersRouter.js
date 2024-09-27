const express = require('express');
const router = express.Router();
const db = require('./config/database');  // 파일 이름이 정확한지 확인하세요

router.get('/getUsers', async (req, res) => {
    try {
        const lines = await db.getLine();
        res.json({ status_code: 200, users: lines });
    } catch (err) {
        console.error('Error in /getUsers route:', err);
        res.status(500).json({ message: err.message });
    }
});

// router.get('/getUsers', async (req, res) => {
//     try {
//         const lines = await db.getLine();
//         const formattedData = lines.map(line => ({
//             Time: line.Time,
//             WaitingNumber: line.WaitingNumber,
//             WaitingSpot: line.WaitingSpot,
//             Major: line.Major,
//             ID: line.ID,  // 학번
//             Name: line.Name,
//             NUID: line.NUID  // 추가
//         }));
//         res.json({ status_code: 200, users: formattedData });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });
// 새로운 학생 추가
router.post('/student', async (req, res) => {
    const { ID, Name, NUID, Major, Membership } = req.body;
    try {
        const result = await db.insertStudent([ID, Name, NUID, Major, Membership]);
        res.status(201).json({ message: '학생이 성공적으로 추가되었습니다.', id: result.insertId });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 대기열에 학생 추가
router.post('/line', async (req, res) => {
    const { NUID, Time, WaitingNumber, WaitingSpot } = req.body;
    try {
        const result = await db.insertLine([NUID, Time, WaitingNumber, WaitingSpot, null]);
        res.status(201).json({ message: '대기열에 학생이 성공적으로 추가되었습니다.', id: result.insertId });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 학생 정보 업데이트
router.put('/student/:NUID', async (req, res) => {
    const { NUID } = req.params;
    const { Name, Major, Membership } = req.body;
    try {
        await db.updateStudent(NUID, [Name, Major, Membership]);
        res.json({ message: '학생 정보가 성공적으로 업데이트되었습니다.' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 대기 상태 업데이트 (Received)
router.put('/line/:NUID/received', async (req, res) => {
    const { NUID } = req.params;
    try {
        await db.Received(NUID);
        res.json({ message: '대기 상태가 "받음"으로 업데이트되었습니다.' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 대기 상태 업데이트 (NotReceived)
router.put('/line/:NUID/notreceived', async (req, res) => {
    const { NUID } = req.params;
    try {
        await db.NotReceived(NUID);
        res.json({ message: '대기 상태가 "받지 않음"으로 업데이트되었습니다.' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 대기 위치 업데이트
router.put('/line/:NUID/spot', async (req, res) => {
    const { NUID } = req.params;
    const { WaitingSpot } = req.body;
    try {
        await db.UpdateWaitingSpot(NUID, WaitingSpot);
        res.json({ message: '대기 위치가 성공적으로 업데이트되었습니다.' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 학생 삭제
router.delete('/student/:NUID', async (req, res) => {
    const { NUID } = req.params;
    try {
        await db.deleteStudent(NUID);
        res.json({ message: '학생이 성공적으로 삭제되었습니다.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 대기열에서 학생 제거
router.delete('/line/:NUID', async (req, res) => {
    const { NUID } = req.params;
    try {
        await db.deleteLine(NUID);
        res.json({ message: '대기열에서 학생이 성공적으로 제거되었습니다.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;