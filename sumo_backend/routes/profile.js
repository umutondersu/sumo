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
        const { income } = req.body;
        if (income) {
            db.query("UPDATE customer SET income = ? WHERE user_Id = ?", [income, req.session.user.user_Id], function (err) {
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


router.post('/editincome', async (req, res) => {
    if (req.session.user) {
        const { income } = req.body;
        if (income) {
            db.query("UPDATE customer SET income = ? WHERE user_Id = ?", [income, req.session.user.user_Id], function (err) {
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