const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { json } = require('express');
const url = require('url');
const db = require('../database/database');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();


router.get("/getusers", (req, res) => {
        db.query("SELECT user_Id, name, email, subscription, expert_Id FROM customer", async (err, rows, fields) => {
            if (err) {
                res.redirect(url.format({
                    pathname:"/Admin",
                    query: {
                        "error": "database_error",
                    }
                }));
                throw err;
            }

            const users = JSON.parse(JSON.stringify(rows));

            if (users.length > 0) {
                res.json(rows);
            }
            else {
                res.json([]);
            }
        });
    }
);


module.exports = router;
