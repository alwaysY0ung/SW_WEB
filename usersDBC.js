const mysql = require('mysql2');

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool
({
  host: 'localhost',
  user: 'root',
  database: 'meit',
  password: '@dltpwls!',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const getUsers = async ()=>
  {
    const promisePool = pool.promise(); // proimise 기반: js 에서 비동기 작업을 위한 패턴, 작업이 완료된 후의 처리를 정의하는 방식
    const [rows] = await promisePool.query('SELECT * FROM users ORDER BY Time;');
    console.log(rows);
    return rows;
  };

const Received = async (userId) => {
    const promisePool = pool.promise(); 
    const [rows] = await promisePool.query('UPDATE users SET Receipt = 1 WHERE ID = ?', [userId]);
    console.log(rows);
    return rows;
};

const NotReceived = async (userId) => {
    const promisePool = pool.promise(); 
    const [rows] = await promisePool.query('UPDATE users SET Receipt = 0 WHERE ID = ?', [userId]);
    console.log(rows);
    return rows;
};

const UpdateAlphabet = async (userId, Alphabet) => {
    const promisePool = pool.promise(); 
    const [rows] = await promisePool.query('UPDATE users SET Alphabet = ? WHERE ID = ?', [Alphabet, userId]);
    console.log(rows);
    return rows;
};

  
//   const insertUser = async (values)=>{
//       const promisePool = pool.promise();
//       const [rows] = await promisePool.query('INSERT INTO users (user_id, user_password, user_name) values (?, ?, ?)', values);
//       return rows;
//   };
  
//   const deleteUser = async (userId) => {
//       const promisePool = pool.promise();
//       const [rows] = await promisePool.query('DELETE FROM users WHERE user_id = ?', [userId]);
//       return rows;
//   };
//   const updateUser = async (userId, updatedValues) => {
//       const promisePool = pool.promise();
//       const [rows] = await promisePool.query('UPDATE users SET user_password = ?, user_name = ? WHERE user_id = ?', [...updatedValues, userId]);
//       return rows;
//   };
  
  
  module.exports = 
  {
      getUsers, Received, NotReceived
  };
   