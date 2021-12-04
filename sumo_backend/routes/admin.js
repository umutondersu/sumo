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

router.get("/getcustomers", (req, res) => {
    if(req.session.user) {
        db.query("SELECT user_Id, name, email, income, location FROM customer INNER JOIN expert ON customer.expert_Id = expert.expert_Id WHERE customer.expert_Id = ?", [req.session.user.user_Id], async (err, rows, fields) => {
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
    
}
);

router.get("/getcustomerhabits", (req, res) => {
    const id = req.query.id;
    if (!id) return;
    if(req.session.user) {
        db.query("SELECT * FROM spendinghabits WHERE customer_Id = ?", [id], async (err, rows, fields) => {
            if (err) {
                res.redirect(url.format({
                    pathname:"/Expert",
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
}
);

router.get("/getconversation", (req, res) => {
    const id = req.query.id;
    if (!id) return;
    if(req.session.user) {
        db.query("SELECT * FROM conversation INNER JOIN expert ON conversation.expert_Id = expert.expert_Id WHERE customer_Id = ?", [id], async (err, rows, fields) => {
            if (err) {
                res.redirect(url.format({
                    pathname:"/Expert",
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
}
);

router.post('/sendmessage', (req, res) => {
    const { author, message, customer_Id, expert_Id} = req.body;

    if (message) {
        db.query("INSERT INTO conversation (customer_Id, expert_Id, author, message) VALUES(?, ?, ?, ?)", [customer_Id, expert_Id, author, message], async (err, rows, fields) => {
            if (err) {
                res.json({
                    error: "database_error"
                })
                throw err;
            }
        });
    }
});


module.exports = router;
