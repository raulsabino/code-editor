const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');

function initialize(passport) {
  // function to autheticate user and check if the user email and password is correct
  const authenticateUser = async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, { message: 'Email or password incorrect' });
      }

      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Email or password incorrect' });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
  // serialize user information into the session
  passport.serializeUser((user, done) => done(null, user.email));
  // deserialize user information from the session
  passport.deserializeUser(async (email, done) => {
    try {
      const user = await User.findOne({ email: email });
      done(null, user);
    } catch (e) {
      done(e);
    }
  });
}

module.exports = initialize;