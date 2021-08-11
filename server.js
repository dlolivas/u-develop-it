const express = require('express');
//const mysql = require ('mysql2'); removed and put it in connection.js
const db = require('./db/connection'); //imported file connection.js
const inputCheck = require('./utils/inputCheck');
const apiRoutes = require('./routes/apiRoutes'); //linking to apiRoutes



const PORT = process.env.PORT || 3001;
const app = express();



//Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//apiRoutes 
app.use('/api' , apiRoutes);

//connect to database
/*const db = mysql.createConnection(
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
 ^ delete from server.js and added to connection.js */
// Return ALL DATA in the candidates table using db object using query() method. This method runs the SQL query and executes the callback with all resulting rows that match the query KEY METHOD THAT ALLOWS SQL COMMANDS TO BE WRITTEN IN NODE.JS
/*db.query('SELECT * FROM candidates' , (err, rows) => {
 //   console.log(rows);
}); 
*/
// ^ When this method executes the SQL command, the callback funtcion captures the responses from the query in 2 var the err and rows, if there is no errors in the SQL the err value is null.
//Add a route to handle users request not supported by the app, this route will overwrite all other orutes make usre it is the last one


//Return A SINGLE CANDIDATE without api endpoint
/*db.query('SELECT * FROM candidates WHERE id = 1', ( err, row) => {
    if (err) {
        console.log(err);
    }
    console.log(row);
});
*/


//DELETE CANDIDATE OPERATION
/*db.query('DELETE FROM candidates WHERE id = ?' , 1, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
});
*/

// Not Found response for unmatched routes
app.use((req, res) => {
  res.status(404).end();
});

// Start server after DB connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  // add function to start the express.js server on port 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});