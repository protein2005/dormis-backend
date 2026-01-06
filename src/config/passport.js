const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require('../models/user.model');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;

        let user = await UserModel.findOne({
          $or: [{ googleId: profile.id }, { email }]
        });

        if (!user) {
          user = await UserModel.create({
            googleId: profile.id,
            email,
            fullName: profile.displayName,
            avatar: profile.photos?.[0].value
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          user.avatar = profile.photos?.[0].value;
          await user.save();
        }

        done(null, user);
      } catch (e) {
        done(e, null);
      }
    }
  )
);

module.exports = passport;
