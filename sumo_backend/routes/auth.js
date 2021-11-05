const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { json } = require('express');
const url = require('url');
const db = require('../database/database');
const { body, validationResult } = require('express-validator');
require('dotenv').config();


router.post('/signup', body('email').isEmail(), async (req, res) => {
    
    const {name, surname, email, password, passwordrepeat} = req.body;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        res.redirect(url.format({
            pathname:"/Signup",
            query: {
               "error": "invalid_email",
             }
          }));
    }

    db.query("SELECT * FROM customer",function (err, result, fields) {
        if (err) throw err;
        console.log(result[0].password);
      })
        //password check 
    //name check
    if (password !== passwordrepeat) {
        res.redirect(url.format({
            pathname:"/Signup",
            query: {
               "error": "password_mismatch",
             }
          })
    });
    else if (name) {
        res.send(name);
    }
    else {
        res.send("name null")
    }
});
    
    
    // password hash
    const hashed = await bcrypt.hash(password, 10);

    const valid = await bcrypt.compare(passwordrepeat, hashed);
    if (valid){
        res.send("Valid");
    }
    else {
        res.send("Invalid");
    }



router.post('/login', (req, res) => {
    

});
module.exports = router;

//testing
//testing2