const mysql = require ('mysql2');
const express = require('express');


const PORT = process.env.PORT || 3001;
const app = express();

//Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
// Return all data in the candidates table using db object using query() method. This method runs the SQL query and executes the callback with all resulting rows that match the query KEY METHOD THAT ALLOWS SQL COMMANDS TO BE WRITTEN IN NODE.JS
db.query('SELECT * FROM candidates' , (err, rows) => {
    console.log(rows);
});
// ^ When this method executes the SQL command, the callback funtcion captures the responses from the query in 2 var the err and rows, if there is no errors in the SQL the err value is null.
//Add a route to handle users request not supported by the app, this route will overwrite all other orutes make usre it is the last one
app.use((req, res) => {
    res.status(404).end();
});



// add function to start the express.js server on port 3001
app.listen(PORT, () => {
    console.log('Server running on port ${PORT}');
});