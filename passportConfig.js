﻿const LocalStrategy = require("passport-local").Strategy;
const pool = require("./db");
const bcrypt = require("bcrypt");

function initialize(passport) {
    const authenticateUser = (email, password, done) => {
        pool.query(
            'select * from users where email=$1', [email], (err, result) => {
                if (err) throw err;
                console.log(result.rows);
                if (result.rows.length > 0) {
                    const user = result.rows[0];
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) { throw err; }
                        if (isMatch) { return done(null, user); }
                        else {
                            return done(null, false, { message: "password is not correct" });
                        }
                    });
                }
                else { return done(null, false, { message: "email is not correct" }); }
            }
        );
    };
    passport.use(new LocalStrategy(
        { usernameField: "email", passwordField: "password" },
        authenticateUser
    ));
    passport.serializeUser((user, done) => done(null, user.user_id));
    passport.deserializeUser((id, done) => {
        pool.query('select * from  users where user_id=$1', [id], (err, result) => {
            if (err) { throw err; }
            return done(null, result.rows[0]);
        });
    });
}
module.exports = initialize;