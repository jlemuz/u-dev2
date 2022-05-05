const express= require('express');
//const {  } = require('inquirer');

const inputCheck = require('./utils/inputCheck');

const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require('mysql2');

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: '',
      database: 'election'
    },
    console.log('Connected to the election database.')
  );


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

app.get('/api/candidates', (req, res)=>{
    const sql = `SELECT * FROM candidates`;

    db.query(sql, (err, rows)=>{
        if (err){
            res.status(500).json({ error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: rows
        })
    })
});


app.get('/api/candidates/:id', (req, res)=>{
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row)=>{
        if (err){
            res.status(400).json({ error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: row
        })
    })
});

app.delete('/api/candidates/:id', (req, res)=>{
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result)=>{
        if (err){
            res.status(400).json({ error: err.message});
        } else if (!result.affectedRows){
            res.json({
                message: 'Candidate not found'
            })
        } else{
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            })
        };
    })
});

// Create a candidate
app.post('/api/candidates', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
  VALUES (?,?,?)`;
const params = [body.first_name, body.last_name, body.industry_connected];

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



//   // GET a single candidate
// db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log(row);
//   });

//   app.get('/', (req, res) => {
//     res.json({
//       message: 'Hello World'
//     });
//   });

// Delete a candidate
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log(result);
//   });


  // Create a candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
// VALUES (?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, result) => {
// if (err) {
// console.log(err);
// }
// console.log(result);
// });


  app.use((req, res) => {
    res.status(404).end();
  });