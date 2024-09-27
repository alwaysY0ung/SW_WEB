const mysql = require('mysql2/promise');
const dbConfig = require('./config/database');

// Create the connection pool using the configuration
const pool = mysql.createPool(dbConfig);

const getLine = async () => {
    try {
        const [lines] = await pool.query(`
            SELECT l.*, s.Major AS Major, s.ID, s.Name
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

const Received = async (NUID) => {
    try {
        const [rows] = await pool.query('UPDATE line SET ReceiptConfirmation = 1 WHERE NUID = ?', [NUID]);
        console.log(rows);
        return rows;
    } catch (error) {
        console.error('Error in Received:', error);
        throw error;
    }
};

const NotReceived = async (NUID) => {
    try {
        const [rows] = await pool.query('UPDATE line SET ReceiptConfirmation = 0 WHERE NUID = ?', [NUID]);
        console.log(rows);
        return rows;
    } catch (error) {
        console.error('Error in NotReceived:', error);
        throw error;
    }
};

const UpdateWaitingSpot = async (NUID, WaitingSpot) => {
    try {
        const [rows] = await pool.query('UPDATE line SET WaitingSpot = ? WHERE NUID = ?', [WaitingSpot, NUID]);
        console.log(rows);
        return rows;
    } catch (error) {
        console.error('Error in UpdateWaitingSpot:', error);
        throw error;
    }
};

const insertStudent = async (values) => {
    try {
        const [rows] = await pool.query('INSERT INTO student (ID, Name, NUID, Major, Membership) VALUES (?, ?, ?, ?, ?)', values);
        return rows;
    } catch (error) {
        console.error('Error in insertStudent:', error);
        throw error;
    }
};

const insertLine = async (values) => {
    try {
        const [rows] = await pool.query('INSERT INTO line (NUID, Time, WaitingNumber, WaitingSpot, ReceiptConfirmation) VALUES (?, ?, ?, ?, ?)', values);
        return rows;
    } catch (error) {
        console.error('Error in insertLine:', error);
        throw error;
    }
};

const deleteStudent = async (NUID) => {
    try {
        const [rows] = await pool.query('DELETE FROM student WHERE NUID = ?', [NUID]);
        return rows;
    } catch (error) {
        console.error('Error in deleteStudent:', error);
        throw error;
    }
};

const deleteLine = async (NUID) => {
    try {
        const [rows] = await pool.query('DELETE FROM line WHERE NUID = ?', [NUID]);
        return rows;
    } catch (error) {
        console.error('Error in deleteLine:', error);
        throw error;
    }
};

const updateStudent = async (NUID, updatedValues) => {
    try {
        const [rows] = await pool.query('UPDATE student SET Name = ?, Major = ?, Membership = ? WHERE NUID = ?', [...updatedValues, NUID]);
        return rows;
    } catch (error) {
        console.error('Error in updateStudent:', error);
        throw error;
    }
};

const markAsNotArrived = async (NUID) => {
    try {
        const [rows] = await pool.query('UPDATE line SET ReceiptConfirmation = 0 WHERE NUID = ?', [NUID]);
        console.log(rows);
        return rows;
    } catch (error) {
        console.error('Error in markAsNotArrived:', error);
        throw error;
    }
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
    updateStudent,
    markAsNotArrived
};