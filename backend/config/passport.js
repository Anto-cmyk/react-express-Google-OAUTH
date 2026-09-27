const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const pool = require("./db");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                const googleId = profile.id;
                const email = profile.emails?.[0]?.value;
                const name = profile.displayName;

                if (!email) {
                    return done(null, false);
                }

                // 1. Check whether this Google account
                // already exists in oauth_accounts
                const [oauthAccounts] = await pool.execute(
                    `SELECT *
                     FROM oauth_accounts
                     WHERE provider = ?
                     AND provider_account_id = ?`,
                    ["google", googleId]
                );

                if (oauthAccounts.length > 0) {
                    const oauthAccount = oauthAccounts[0];

                    const [users] = await pool.execute(
                        `SELECT id, name, email
                         FROM users
                         WHERE id = ?`,
                        [oauthAccount.user_id]
                    );

                    return done(null, users[0]);
                }

                // 2. Google account doesn't exist.
                // Check whether the email already exists.
                const [users] = await pool.execute(
                    `SELECT id, name, email
                     FROM users
                     WHERE email = ?`,
                    [email]
                );

                let user;

                if (users.length > 0) {
                    // Existing normal account
                    user = users[0];
                } else {
                    // Create a new user
                    const [result] = await pool.execute(
                        `INSERT INTO users
                         (name, email, password_hash)
                         VALUES (?, ?, NULL)`,
                        [name, email]
                    );

                    user = {
                        id: result.insertId,
                        name,
                        email
                    };
                }

                // 3. Connect Google account to our user
                await pool.execute(
                    `INSERT INTO oauth_accounts
                     (user_id, provider, provider_account_id)
                     VALUES (?, ?, ?)`,
                    [
                        user.id,
                        "google",
                        googleId
                    ]
                );

                return done(null, user);

            } catch (error) {
                console.error("Google OAuth error:", error);
                return done(error, null);
            }
        }
    )
);

module.exports = passport;