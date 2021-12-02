const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const habitsRoute = require('./routes/profile');
const adminRoute = require('./routes/admin');
const mysql = require('mysql');
const db = require('./database/database');
const jwt = require('jsonwebtoken');
const session = require('express-session');

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`App listening on port ${port}`));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.use(
    session({
        key: "email",
        secret: "SumoSuperSecret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60000* 60 * 24,
        },
    })
);

app.use('/auth', authRoute);
app.use('/profile', habitsRoute);
app.use('/admin', adminRoute);
