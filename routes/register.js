'use strict'
const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");
var flash = require('express-flash');

const router = express.Router();

router.get('/', (req, res) => {
    res.render("register");
});
router.post("/", (req, res) => {
    let { name, email, password, password2 } = req.body;
    let errors = [];
    if (!name || !email || !password || !password2) {
        errors.push({ message: "Please enter all fields" });
    }
    if (password.length < 6) {
        errors.push({ message: "Password must be a least 6 characters long" });
    }
    if (password !== password2) {
        errors.push({ message: "Passwords do not match" });
    }
    if (errors.length > 0) {
        res.render("register", { errors });
        console.log(errors);
    }
    else {
        var hashPassword = bcrypt.hashSync(password, 10);
        /*bcrypt.hash(password, 10, function (err, hash) {
            if (err) { console.log(err); }
            else {
                console.log(hash);
            }
        });*/
        pool.query(
            'select * from users where email=$1', [email], (err, result) => {
                if (err) throw err;
                console.log(result.rows);
                if (result.rows.length > 0) {
                    errors.push({ message: 'email already in use' });
                    res.render('register', { errors });
                } else {
                    pool.query(
                        'insert into users (name,email,password)\
                        values ($1,$2,$3)\
                        returning user_id,password', [name, email, hashPassword], (err, result) => {
                            if (err) throw err;
                            console.log(result.rows);
                            req.flash('success', "You are now reisterd. Please log in");
                            res.redirect('/login');
                        }
                    );
                }
            }
        );
    }
});

module.exports = router;