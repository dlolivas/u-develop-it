const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

router.get('/voters', (req, res) => {
    //add sort option to return voters in alphabetical order
    const sql = `SELECT * FROM voters ORDER BY last_name`;
  
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: rows,
      });
    });
});

//Get single voter
router.get('/voter/:id', (req, res) => {
    const sql = `SELECT * FROM voters WHERE id = ?`;
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

// allow people to register through the app CREATE A POST ROUTE, when user types first and last name with the emiail adress we can write the route to appear like the following code
router.post('voter' , ({ body }, res ) => {
  const sql = `INSERT INTO voters (first_name, last_name, email) VALUES (?,?,?)`;
  // the ? will protect us from malicious data but we don't want blank records beaing created 
  //data validation no blank records
  const errors = inputCheck(body, 'first_name', 'last_name', 'email');
  if (errors) {
  res.status(400).json({ error: errors });
  return;
}
  const params = [body.first_name, body.last_name, body.email];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

// PUT ROUTE USERS CAN UPDATE THEIR EMAIL ADDRESS
router.put('/voter/:id', (req, res) => {
    // Data validation
    const errors = inputCheck(req.body, 'email');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
  
    const sql = `UPDATE voters SET email = ? WHERE id = ?`;
    const params = [req.body.email, req.params.id]; // COMBINATION OF REQ.PARAMS TO CAPTURE WHO IS BEING UPDATED 
  
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
      } else if (!result.affectedRows) {
        res.json({
          message: 'Voter not found'
        });
      } else {
        res.json({
          message: 'success',
          data: req.body,// REQ BODY TO CAPTURE WHAT IS BEING UPDATED
          changes: result.affectedRows
        });
      }
    });
});

//DELETE ROUTE REMOVE VOTERS FROM DATABASE
router.delete('/voter/:id', (req, res) => {
    const sql = `DELETE FROM voters WHERE id = ?`;
  
    db.query(sql, req.params.id, (err, result) => {
      if (err) {
        res.status(400).json({ error: res.message });
      } else if (!result.affectedRows) {
        res.json({
          message: 'Voter not found'
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


//export router obj
module.exports = router;