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
        db.query("SELECT user_Id, name, email, subscription, expert_name, customer.expert_Id FROM customer LEFT JOIN expert ON customer.expert_Id = expert.expert_Id", async (err, rows, fields) => {
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

router.get("/isAdmin", (req, res) => {
    if (req.session.admin) {
        db.query("SELECT * FROM admin WHERE admin_Id = ?", [req.session.admin.user_Id], async (err, rows, fields) => {
            if (err) {
                res.redirect(url.format({
                    pathname:"/AdminLogin",
                    query: {
                        "error": "database_error",
                    }
                }));
                throw err;
            }
            if (rows[0].admin_email != req.session.admin.email) {
                res.json({status: "Invalid"});
            }
            res.json({status: "success"})
        });
    }
    else {
        res.json({status: "Invalid"});
    }
})

router.post("/addExpert", (req,res) => {
    if (req.session.admin) {
        const { name, email, password } = req.body;
        db.query("SELECT * FROM expert WHERE expert_email = ?", [email], async (err, rows, fields) => {
            if (err) {
                res.redirect(url.format({
                    pathname:"/ExpertLogin",
                    query: {
                        "error": "database_error",
                    }
                }));
                throw err;
            }
            if (rows.length > 0) {
                res.json({error: "Expert is already registered"})
            }
            else {
                const hashed = bcrypt.hashSync(password, 10);
                db.query("INSERT INTO expert (expert_name, expert_email, expert_password) VALUES(?, ?, ?)", [name, email, hashed], function (err) {
                    if (err) {
                        res.redirect(url.format({
                            pathname:"/Admin",
                            query: {
                                "error": "database_error",
                            }
                        }));
                        throw err;
                    }
                });
                res.json({success: true})
            }
        });
    }
})

router.get("/isExpert", (req, res) => {
    if (req.session.user) {
        db.query("SELECT * FROM expert WHERE expert_Id = ?", [req.session.user.user_Id], async (err, rows, fields) => {
            if (err) {
                res.redirect(url.format({
                    pathname:"/ExpertLogin",
                    query: {
                        "error": "database_error",
                    }
                }));
                throw err;
            }
            if (rows[0].expert_email != req.session.user.email) {
                res.json({status: "Invalid"});
            }
            res.json({status: "success"})
        });
    }
    else {
        res.json({status: "Invalid"});
    }
})

router.post("/removeexpert", (req,res) => {
    const { id } = req.body;
    if (req.session.admin) {
        db.query("DELETE FROM expert WHERE expert_Id = ?", [id], async (err, rows, fields) => {
            if (err) {
                res.redirect(url.format({
                    pathname:"/Admin",
                    query: {
                        "error": "database_error",
                    }
                }));
                throw err;
            }
            res.json({
                success: true
            })
        });
    }
});

router.post("/removecustomer", (req,res) => {
    const { id } = req.body;
    if (req.session.admin) {
        db.query("DELETE FROM customer WHERE user_Id = ?", [id], async (err, rows, fields) => {
            if (err) {
                res.redirect(url.format({
                    pathname:"/Admin",
                    query: {
                        "error": "database_error",
                    }
                }));
                throw err;
            }
            res.json({
                success: true
            })
        });
    }
    
})

router.post("/assignexpert", (req,res) => {
    const { user_id, expert_id } = req.body;
    if (req.session.admin) {
        
        db.query("UPDATE customer SET expert_Id = ? WHERE user_Id = ?", [expert_id == -1 ? null : expert_id, user_id], async (err, rows, fields) => {
            if (err) {
                res.redirect(url.format({
                    pathname:"/Admin",
                    query: {
                        "error": "database_error",
                    }
                }));
                throw err;
            }
            res.json({
                success: true
            })
        });
    }
    
})


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
    
});

router.get("/getexperts", (req,res) => {
    db.query("SELECT expert_Id, expert_name, expert_email FROM expert", async (err, rows, fields) => {
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
}) 

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
    const { author, message, customer_Id, expert_Id, pinned} = req.body;

    if (message) {
        db.query("INSERT INTO conversation (customer_Id, expert_Id, author, message, pinned) VALUES(?, ?, ?, ?, ?)", [customer_Id, expert_Id, author, message, pinned], async (err, rows, fields) => {
            if (err) {
                res.json({
                    error: "database_error"
                })
                throw err;
                
            }
            res.json(200)
        });
    }
});

router.post('/setpinned', (req, res) => {
    const { conversation_Id, pinned} = req.body;

    db.query("UPDATE conversation SET pinned = ? WHERE conversation_Id = ?", [pinned, conversation_Id], async (err) => {
        if (err) {
            res.json({
                error: "database_error"
            })
            throw err;
        }
        res.json(200)
    });
});


module.exports = router;
