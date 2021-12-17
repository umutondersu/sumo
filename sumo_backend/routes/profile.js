const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { json } = require('express');
const url = require('url');
const db = require('../database/database');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

router.post('/remove', async (req, res) => {
    const { habit_Id } = req.body;

    db.query("DELETE FROM spendinghabits WHERE habit_Id = ?", [habit_Id], function (err) {
        if (err) {
            res.redirect(url.format({
                pathname:"/Profile",
                query: {
                    "error": "database_error",
                }
            }));
            throw err;
        }
    });

    res.json({success: true})

});

router.post('/addhabit', async (req, res) => {
    if (req.session.user) {
        const {data} = req.body;

        db.query("INSERT INTO spendinghabits (customer_Id, spending_Type, spending_Value) VALUES(?, ?, ?)", [req.session.user.user_Id, data.habit, data.value], function (err) {
            if (err) {
                res.redirect(url.format({
                    pathname:"/Profile",
                    query: {
                        "error": "database_error",
                    }
                }));
                throw err;
            }
            res.json({success: true});
        });
    }
    else {
        res.send({error: "editHabitError"})
    }
});


router.post('/edithabits', async (req, res) => {
    if (req.session.user) {
        const {data} = req.body;

        db.query("UPDATE spendinghabits SET spending_Type = ?, spending_Value = ? WHERE habit_Id = ?", [data.habit, data.value, data.habit_Id], function (err) {
            if (err) {
                res.redirect(url.format({
                    pathname:"/Profile",
                    query: {
                        "error": "database_error",
                    }
                }));
                throw err;
            }
        });

        res.json({success: true});

    }
    else {
        res.send({error: "editHabitError"})
    }
});




router.post('/editincome', async (req, res) => {
    if (req.session.user) {
        const { income } = req.body;
        if (income) {

            var prevIncome = 0;
            var currentTime = new Date(Date.now());
            db.query("SELECT income FROM customer WHERE user_Id = ?", [req.session.user.user_Id], function (err, rows, fields) {
                if (err) {
                    res.redirect(url.format({
                        pathname:"/Summary",
                        query: {
                            "error": "database_error",
                        }
                    }));
                    throw err;
                }
                if (rows[0]) {
                    prevIncome = rows[0].income;
                }
            });

            db.query("INSERT INTO income (customer_Id, income_Value, income_change, date) VALUES(?, ?, ?, ?)", [req.session.user.user_Id, income, income-prevIncome, currentTime], function (err) {
                if (err) {
                    res.redirect(url.format({
                        pathname:"/Summary",
                        query: {
                            "error": "database_error",
                        }
                    }));
                    throw err;
                }
            });
            db.query("UPDATE customer SET income = ? WHERE user_Id = ?", [income, req.session.user.user_Id], function (err) {
                if (err) {
                    res.redirect(url.format({
                        pathname:"/Summary",
                        query: {
                            "error": "database_error",
                        }
                    }));
                    throw err;
                }
            });
            res.json({success: true})
        }
    }
    else {
        res.send({error: "editIncomeError"})
    }
});

router.post('/editlocation', async (req, res) => {
    if (req.session.user) {
        const { location } = req.body;
        if (location) {
            db.query("UPDATE customer SET location = ? WHERE user_Id = ?", [location, req.session.user.user_Id], function (err) {
                if (err) {
                    res.redirect(url.format({
                        pathname:"/Profile",
                        query: {
                            "error": "database_error",
                        }
                    }));
                    throw err;
                }
            });
            res.json({success: true})
        }
    }
    else {
        res.send({error: "editIncomeError"})
    }
});

router.get("/income", (req, res) => {
    if (req.session.user) {
        db.query("SELECT * FROM income WHERE customer_Id = ?", [req.session.user.user_Id], async (err, rows, fields) => {
            if (err) {
                res.redirect(url.format({
                    pathname:"/Summary",
                    query: {
                        "error": "database_error",
                    }
                }));
                throw err;
            }

            const income = JSON.parse(JSON.stringify(rows));

            if (income.length > 0) {
                res.json(rows);
            }
            else {
                res.json([]);
            }
        });
    }
    else {
        res.send({});
    }
});


module.exports = router;