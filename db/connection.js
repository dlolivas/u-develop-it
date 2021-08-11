const mysql = require ('mysql2');

//connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        //your MySQL username,
        user: 'root',
        // your sql password
        password: 'Santiago20!',
        database: 'election'

    },
    console.log('Connected to the election database.')
);


//Because this file is its own module we will need to export it by adding 
module.exports = db;