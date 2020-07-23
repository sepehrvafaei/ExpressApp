const express = require("express");
var flash = require("express-flash");
const passport = require("passport");

const router = express.Router();

router.get('/', (req, res) => {
    res.render("login", {
        expressFlash: req.flash('success'),
    });
});
router.post('/', passport.authenticate('local', {
    successRedirect: "/dashboard",
    failureRedirect: "/",
    failureFlash: true
}));

module.exports = router;