const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const mysql = require('mysql');
const db = require('./database/database');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`App listening on port ${port}`));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use('/auth', authRoute);
//app.use("*", (req, res) => res.status(404).json({error: "not found"}));
