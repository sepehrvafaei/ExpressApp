const express = require("express");
const flash = require("express-flash");
const router = express.Router();

router.get('/', (req, res) => {
    req.logOut();
    req.flash("success", "you have logged out");
    res.redirect("/login");
});
module.exports = router;