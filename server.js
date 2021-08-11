const express = require('express');
const mysql = require ('mysql2');
const inputCheck = require('./utils/inputCheck');



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

// Get all candidates and their party affiliation
app.get('/api/candidates', (req, res) => {
  const sql = `SELECT candidates.*, parties.name 
                AS party_name 
                FROM candidates 
                LEFT JOIN parties 
                ON candidates.party_id = parties.id`;
                
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message }); // instead of an err we'll send a status code of 500 and place the err msj within JSON obj
      return;
    }
    res.json({
      message: 'success', // if there is not an err the response will be sent back saying sucess
      data: rows
    });
  });
});

// Get single candidate with party affiliation
app.get('/api/candidate/:id', (req, res) => { //api endpoint has an :id which specify which candidate we'll select 
  const sql = `SELECT candidates.*, parties.name 
               AS party_name 
               FROM candidates 
               LEFT JOIN parties 
               ON candidates.party_id = parties.id 
               WHERE candidates.id = ?`; //mention id
  const params = [req.params.id];// we'll assign the captured value populated in the re.params obj with the key id to params. Params is assigned as an array with a single element req.params.id

  db.query(sql, params, (err, row) => {// the database then query the candidates table with this id and retrive the row specififed bcuz params can be accepted in the database call as an array.
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// Create a candidate we use post to create or insert a new candidate into table 
app.post('/api/candidate', ({ body }, res) => {
  // Candidate is allowed not to be affiliated with a party
  const errors = inputCheck(
    body,
    'first_name',
    'last_name',
    'industry_connected'
  );
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
//add database call
  const sql = `INSERT INTO candidates (first_name, last_name, industry_connected, party_id) VALUES (?,?,?,?)`;
  const params = [
    body.first_name,
    body.last_name,
    body.industry_connected,
    body.party_id
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body,
      changes: result.affectedRows
    });
  });
});

// Update a candidate's party
app.put('/api/candidate/:id', (req, res) => {
  // Candidate is allowed to not have party affiliation
  const errors = inputCheck(req.body, 'party_id');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `UPDATE candidates SET party_id = ? 
               WHERE id = ?`;
  const params = [req.body.party_id, req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      // check if a record was found
    } else if (!result.affectedRows) {
      res.json({
        message: 'Candidate not found'
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

// Delete a candidate WITH API ENDPOINT 
app.delete('/api/candidate/:id', (req, res) => { // 
  const sql = `DELETE FROM candidates WHERE id = ?`; // we are assigning the sql to delete from candidates table , where do we want to delete it by the id
  const params = [req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) { // if user wants to delete  a candidate that does not exist no affectedRows as a result of the delete query means that there was no candidate by that id
      res.json({
        message: 'Candidate not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

// Get all parties
app.get('/api/parties', (req, res) => {
  const sql = `SELECT * FROM parties`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Get single party
app.get('/api/party/:id', (req, res) => {
  const sql = `SELECT * FROM parties WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// Delete a party
app.delete('/api/party/:id', (req, res) => {
  const sql = `DELETE FROM parties WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
      // checks if anything was deleted
    } else if (!result.affectedRows) {
      res.json({
        message: 'Party not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

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