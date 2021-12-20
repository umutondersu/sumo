const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { json } = require('express');
const url = require('url');
const db = require('../database/database');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

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


    const hashed = bcrypt.hashSync(password, 10);


    db.query("SELECT * FROM admin", function (err, rows, fields) {
        if (err) {
            throw err;
        }
        if (rows.length == 0) {
            db.query("INSERT INTO admin (admin_email, admin_password) VALUES(?, ?)", [email, hashed], function (err) {
                if (err) {
                    res.redirect(url.format({
                        pathname:"/Signup",
                        query: {
                            "error": "database_error",
                        }
                    }));
                    throw err;
                }
            });
        }
    });


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
                pathname:"/",
            }));
        }
    });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log("token    :    " + authHeader);
    if (authHeader == null) {
        res.redirect(url.format({
            pathname:"/",
        }));
    }
    else {
        jwt.verify(authHeader, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                res.redirect(url.format({
                    pathname:"/",
                }));
            }
            req.user = user;
            next();
        });
    }
}

router.get("/habits", (req, res) => {
    if (req.session.user) {
        db.query("SELECT * FROM spendinghabits WHERE customer_Id = ?", [req.session.user.user_Id], async (err, rows, fields) => {
            if (err) {
                res.redirect(url.format({
                    pathname:"/Profile",
                    query: {
                        "error": "database_error",
                    }
                }));
                throw err;
            }

            const habits = JSON.parse(JSON.stringify(rows));

            if (habits.length > 0) {
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

router.get('/profile', (req, res)=> {
    if (req.session.user) {

        db.query("SELECT * FROM customer WHERE email = ?", [req.session.user.email], async (err, rows, fields) => {
            if (err) {
                res.redirect(url.format({
                    pathname:"/Profile",
                    query: {
                        "error": "database_error",
                    }
                }));
                throw err;
            }
            else if (rows[0]) {
                res.json(rows[0]);
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

    }
    
});

router.get("/isLogin", (req, res) => {
    if (req.session.user) {
        db.query("SELECT user_Id, name, email, income, location FROM customer WHERE user_Id = ?", [req.session.user.user_Id], async (err, rows, fields) => {
            if (err) {
                res.redirect(url.format({
                    pathname:"/",
                    query: {
                        "error": "database_error",
                    }
                }));
                throw err;
            }
            if (rows[0].email != req.session.user.email) {
                res.send({ loggedIn: false });
            }
            res.send({ loggedIn: true, user: req.session.user });
        });
    } else {
        res.send({ loggedIn: false });
    }
});
    

router.post('/login', body('email').isEmail(), (req, res) => {
    const { email, password} = req.body;

    const errors = validationResult(req);
    if (email) {
        if (!errors.isEmpty()) {
            res.json({
                error: "invalid_email"
            })
        }
    }
    else {
        res.json({
            error: "email_empty"
        })
    }
    
    if (!password) {
        res.json({
            error: "password_empty"
        })
    }
    else {
        db.query("SELECT * FROM customer WHERE email = ?", [email], async (err, rows, fields) => {
            if (err) {
                res.json({
                    error: "database_error"
                })
                throw err;
            }
            if (rows[0]) {

                var cPwd = rows[0].password;

                const valid = await bcrypt.compare(password, cPwd);
                if (!valid){
                    res.json({
                        error: "invalid_password"
                    })
                }
                else {
                    const user = {
                        email: rows[0].email,
                        name: rows[0].name,
                        user_Id: rows[0].user_Id
                    }
                    const accessToken = jwt.sign(user, process.env.JWT_SECRET);
                    /*res.redirect(url.format({
                        pathname:"/Profile",
                    }));*/

                    req.session.user = user;
                    
                    res.send(user);
                    /*res.json({
                        name: user.name,
                        email: user.email,
                        accessToken
                    })*/
                }
            }
            else {
                res.json({
                    error: "user_not_found"
                })
            }
        });
    }

    


});

router.post('/expertlogin', body('email').isEmail(), (req, res) => {
    const { email, password} = req.body;

    const errors = validationResult(req);
    if (email) {
        if (!errors.isEmpty()) {
            res.json({
                error: "invalid_email"
            })
        }
    }
    else {
        res.json({
            error: "email_empty"
        })
    }
    
    if (!password) {
        res.json({
            error: "password_empty"
        })
    }
    else {
        db.query("SELECT * FROM expert WHERE expert_email = ?", [email], async (err, rows, fields) => {
            if (err) {
                res.json({
                    error: "database_error"
                })
                throw err;
            }
            if (rows[0]) {

                var cPwd = rows[0].expert_password;

                const valid = await bcrypt.compare(password, cPwd);
                if (!valid){
                    res.json({
                        error: "invalid_password"
                    })
                }
                else {
                    const user = {
                        email: rows[0].expert_email,
                        user_Id: rows[0].expert_Id,
                        expert: true
                    }
                    const accessToken = jwt.sign(user, process.env.JWT_SECRET);
                    /*res.redirect(url.format({
                        pathname:"/Profile",
                    }));*/

                    req.session.user = user;
                    
                    res.send(user);
                    /*res.json({
                        name: user.name,
                        email: user.email,
                        accessToken
                    })*/
                }
            }
            else {
                res.json({
                    error: "expert_not_found"
                })
            }
        });
    }

    


});

router.post('/adminlogin', body('email').isEmail(), (req, res) => {
    const { email, password} = req.body;

    const errors = validationResult(req);
    if (email) {
        if (!errors.isEmpty()) {
            res.json({
                error: "invalid_email"
            })
        }
    }
    else {
        res.json({
            error: "email_empty"
        })
    }
    
    if (!password) {
        res.json({
            error: "password_empty"
        })
    }
    else {
        db.query("SELECT * FROM admin WHERE admin_email = ?", [email], async (err, rows, fields) => {
            if (err) {
                res.json({
                    error: "database_error"
                })
                throw err;
            }
            if (rows[0]) {

                var cPwd = rows[0].admin_password;

                const valid = await bcrypt.compare(password, cPwd);
                if (!valid){
                    res.json({
                        error: "invalid_password"
                    })
                }
                else {
                    const user = {
                        email: rows[0].admin_email,
                        user_Id: rows[0].admin_Id,
                        admin: true
                    }
                    const accessToken = jwt.sign(user, process.env.JWT_SECRET);
                    /*res.redirect(url.format({
                        pathname:"/Profile",
                    }));*/

                    req.session.admin = user;
                    
                    res.send(user);
                    /*res.json({
                        name: user.name,
                        email: user.email,
                        accessToken
                    })*/
                }
            }
            else {
                res.json({
                    error: "admin_not_found"
                })
            }
        });
    }

    


});

router.post('/logout', authenticateToken, (req, res) => {
});
module.exports = router;
