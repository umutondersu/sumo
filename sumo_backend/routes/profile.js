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

router.post('/edithabits', async (req, res) => {
    if (req.session.user) {
        const {newarr, oldarr} = req.body;

        for(let i = 0; i<newarr.length; i++) {
            if (newarr[i].habit && newarr[i].value) {
                db.query("INSERT INTO spendinghabits (customer_Id, spending_Type, spending_Value) VALUES(?, ?, ?)", [req.session.user.user_Id, newarr[i].habit, newarr[i].value], function (err) {
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
            }
        }

        for(let i = 0; i<oldarr.length; i++) {
            if (oldarr[i].habit && oldarr[i].value) {
                db.query("UPDATE spendinghabits SET spending_Type = ?, spending_Value = ? WHERE habit_Id = ?", [oldarr[i].habit, oldarr[i].value, oldarr[i].habit_Id], function (err) {
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
            }
        }

        res.redirect(url.format({
            pathname:"/Profile",
        }));

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
            var currentTime = new Date();
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
                if (rows[0].income) {
                    prevIncome = rows[0];
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
        }
    }
    else {
        res.send({error: "editIncomeError"})
    }
});


module.exports = router;