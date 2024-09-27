const mysql = require('mysql2');
const dbConfig = require('./config/database');

// Create the connection pool using the configuration
const pool = mysql.createPool(dbConfig);

const getLine = async () => {
    try {
        const [lines] = await pool.query(`
            SELECT l.*, s.Major AS major, s.ID, s.Name
            FROM line l
            JOIN student s ON l.NUID = s.NUID
            ORDER BY l.Time;
        `);
        console.log('Lines fetched:', lines);
        return lines;
    } catch (error) {
        console.error('Error in getLine:', error);
        throw error;
    }
};
// FROM 코드라인: // NUID, 대기등록시간, 대기등록번호, 대기위치, 대기상태변경 from line table
// JOIN 코드라인:     // line에, student table의 학생정보들

const Received = async (NUID) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query('UPDATE line SET ReceiptConfirmation = 1 WHERE NUID = ?', [NUID]);
    console.log(rows);
    return rows;
};

const NotReceived = async (NUID) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query('UPDATE line SET ReceiptConfirmation = 0 WHERE NUID = ?', [NUID]);
    console.log(rows);
    return rows;
};

const UpdateWaitingSpot = async (NUID, WaitingSpot) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query('UPDATE line SET WaitingSpot = ? WHERE NUID = ?', [WaitingSpot, NUID]);
    console.log(rows);
    return rows;
};

const insertStudent = async (values) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query('INSERT INTO student (ID, Name, NUID, Major, Membership) VALUES (?, ?, ?, ?, ?)', values);
    return rows;
};

const insertLine = async (values) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query('INSERT INTO line (NUID, Time, WaitingNumber, WaitingSpot, ReceiptConfirmation) VALUES (?, ?, ?, ?, ?)', values);
    return rows;
};

const deleteStudent = async (NUID) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query('DELETE FROM student WHERE NUID = ?', [NUID]);
    return rows;
};

const deleteLine = async (NUID) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query('DELETE FROM line WHERE NUID = ?', [NUID]);
    return rows;
};

const updateStudent = async (NUID, updatedValues) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query('UPDATE student SET Name = ?, Major = ?, Membership = ? WHERE NUID = ?', [...updatedValues, NUID]);
    return rows;
};

module.exports = {
    getLine,
    Received,
    NotReceived,
    UpdateWaitingSpot,
    insertStudent,
    insertLine,
    deleteStudent,
    deleteLine,
    updateStudent
};

//     getLine:
//     기능: line과 student 테이블을 조인하여 모든 대기 정보와 학생 정보를 함께 가져옵니다.
//     Received:
// 기능: 특정 NUID를 가진 학생의 ReceiptConfirmation을 1(받음)로 업데이트합니다.
//     NotReceived:
// 기능: 특정 NUID를 가진 학생의 ReceiptConfirmation을 0(받지 않음)으로 업데이트합니다.
//     UpdateWaitingSpot:
// 기능: 특정 NUID를 가진 학생의 WaitingSpot을 업데이트합니다.
//     insertStudent:
// 기능: student 테이블에 새로운 학생 정보를 삽입합니다.
//     insertLine:
// 기능: line 테이블에 새로운 대기 정보를 삽입합니다.
//     deleteStudent:
// 기능: student 테이블에서 특정 NUID를 가진 학생 정보를 삭제합니다.
//     deleteLine:
// 기능: line 테이블에서 특정 NUID를 가진 대기 정보를 삭제합니다.
//     updateStudent:
// 기능: student 테이블에서 특정 NUID를 가진 학생의 정보(이름, 전공, 멤버십 상태)를 업데이트합니다