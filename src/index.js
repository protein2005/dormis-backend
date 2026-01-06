require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');
const errorMiddleware = require('./middlewares/error.middleware');
const passport = require('./config/passport');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api", router);

app.use(errorMiddleware)

const main = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    })
  } catch (e) {
    console.log(e);
  }
};

main();
