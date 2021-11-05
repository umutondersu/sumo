const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const session = require('express-session');
const mysql = require('mysql');
const db = require('./database/database');

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`App listening on port ${port}`));

app.use(cors());
app.use(express.urlencoded());
app.use('/auth', authRoute);
app.use(session({
    secret: 'SumoSuperSecret',
    cookie: {
        maxAge: 60000 * 60 * 24,
    },
    saveUninitialized: false
}));
//app.use("*", (req, res) => res.status(404).json({error: "not found"}));
