const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });


const express = require('express');

const app = express();
app.use(express.json());
app.use('/api/boards', require('./routes/boards'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.listen(3000, '127.0.0.1', () => {
  console.log('Serwer: http://localhost:3000');
});