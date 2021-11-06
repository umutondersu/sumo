const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { json } = require('express');
const url = require('url');
const db = require('../database/database');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();


router.post('/signup', body('email').isEmail(), async (req, res) => {
    
    const {name, email, password, passwordrepeat, error} = req.body;
    const errors = validationResult(req);
    if (email) {
        if (!errors.isEmpty()) {
            res.redirect(url.format({
                pathname:"/Signup",
                query: {
                    "error": "invalid_email",
                }
            }));
        }
        db.query("SELECT * FROM customer WHERE email = ?", [email], function (err, rows, fields) {
            if (err) {
                res.redirect(url.format({
                    pathname:"/Signup",
                    query: {
                        "error": "database_error",
                    }
                }));
                throw err;
            }
            if (rows[0]) {
                res.redirect(url.format({
                    pathname:"/Signup",
                    query: {
                        "error": "email_exists",
                    }
                }));
            }
        });
    }
    else {
        res.redirect(url.format({
            pathname:"/Signup",
            query: {
                "error": "email_empty",
            }
        }));
    }

    // password hash

    var cName = "";

        //password check 
    //name check
    if (password && passwordrepeat) {
        if (password !== passwordrepeat) {
            res.redirect(url.format({
                pathname:"/Signup",
                query: {
                    "error": "password_mismatch",
                }
            }));
        }
    }
    else {
        res.redirect(url.format({
            pathname:"/Signup",
            query: {
                "error": "password_empty",
            }
        }));
    }
    
    if (name) {
        cName = name;
    }
    else {
        cName = "Anonymous";
    }

    db.query("INSERT INTO customer (email, password, name) VALUES(?, ?, ?)", [email, hashed, cName], function (err, rows, fields) {
        if (err) {
            res.redirect(url.format({
                pathname:"/Signup",
                query: {
                    "error": "database_error",
                }
            }));
            throw err;
        }
        else {
            res.redirect(url.format({
                pathname:"/Login",
            }));
        }
    });

});
    

router.post('/login', body('email').isEmail(), (req, res) => {
    const { email, password, error } = req.body;

    const errors = validationResult(req);
    if (email) {
        if (!errors.isEmpty()) {
            res.redirect(url.format({
                pathname:"/",
                query: {
                    "error": "invalid_email",
                }
            }));
        }
    }
    else {
        res.redirect(url.format({
            pathname:"/",
            query: {
                "error": "email_empty",
            }
        }));
    }
    
    if (!password) {
        res.redirect(url.format({
            pathname:"/",
            query: {
                "error": "password_empty",
            }
        }));
    }

    db.query("SELECT * FROM customer WHERE email = ?", [email], async (err, rows, fields) => {
        if (err) {
            res.redirect(url.format({
                pathname:"/",
                query: {
                    "error": "database_error",
                }
            }));
            throw err;
        }
        if (rows[0]) {

            var cPwd = rows[0].password;

            const valid = await bcrypt.compare(password, cPwd);
            if (!valid){
                res.redirect(url.format({
                    pathname:"/",
                    query: {
                        "error": "invalid_password",
                    }
                }));
            }
            else {
                res.redirect(url.format({
                    pathname:"/Profile",
                }));
            }
        }
        else {
            res.redirect(url.format({
                pathname:"/",
                query: {
                    "error": "user_not_found",
                }
            }));
        }
    });


});

router.post('/logout', (req, res) => {
});
module.exports = router;
