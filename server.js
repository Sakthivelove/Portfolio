const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

// Configure multer for parsing multipart/form-data
const upload = multer();

// Database connection
const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
});

// Serve static files (like your HTML file)
app.use(express.static('public'));

// Handle form submission with multipart/form-data
app.post('/contact', upload.none(), async (req, res) => {
  // `req.body` should now contain the form fields
  console.log(req.body);  // Check the incoming data

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).send('All fields are required.');
  }

  try {
    const query = 'INSERT INTO contact_form(name, email, subject, message) VALUES($1, $2, $3, $4)';
    await pool.query(query, [name, email, subject, message]);
    res.send('Your message has been sent. Thank you!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error sending message.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
