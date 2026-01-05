require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors())
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello Dormis!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})