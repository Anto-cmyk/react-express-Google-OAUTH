const express = require("express");
const passport = require("../config/passport");

const {
    register,
    login
} = require("../controllers/authController");

const generateToken = require("../utils/generateToken");

const router = express.Router();


// Normal authentication
router.post("/register", register);
router.post("/login", login);


// Start Google OAuth
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);


// Google callback
router.get(
    "/google/callback",

    passport.authenticate("google", {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/login`
    }),

    (req, res) => {
        const token = generateToken(req.user);

        res.redirect(
            `${process.env.FRONTEND_URL}/dashboard?token=${token}`
        );
    }
);

module.exports = router;