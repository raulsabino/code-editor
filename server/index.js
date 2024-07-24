if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 8000;

// connecting to mongodb
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// getting the user models
const User = require('./models/User');
const Project = require('./models/Projects');

// calling the passport config function
const initializePassport = require('./passport-config');
initializePassport(
  passport,
  email => User.findOne({ email: email })
);

app.set('views', path.join(__dirname, '../client/views'));
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '../client/public')));
app.use(methodOverride('_method'));
app.use(express.json());

// main page
app.get('/', checkAuthenticated, async (req, res) => {
  res.render('index.ejs');
});

// saves the html code and user email to the database
app.post('/saveCode', checkAuthenticated, async (req, res) => {
  const email = req.user.email;

  try {
    const projectData = {
      html: req.body.html === undefined ? undefined : req.body.html,
      css: req.body.css === undefined ? undefined : req.body.css,
      js: req.body.js === undefined ? undefined : req.body.js
    };

    const existingProject = await Project.findOne({ email: email });
    if (existingProject) {
      // this will only update if the code is existent so for example if there is no js code but there is an html and css then only the html and css will be updated
      if (projectData.html !== undefined) existingProject.html = projectData.html;
      if (projectData.css !== undefined) existingProject.css = projectData.css;
      if (projectData.js !== undefined) existingProject.js = projectData.js;
      await existingProject.save();
    } else {
      const newProject = new Project({
        email: email,
        ...projectData
      });
      await newProject.save();
    }
    res.status(200).send('Code saved successfully');
  } catch (e) {
    console.error('Error saving code:', e);
    res.status(500).send('Error saving code');
  }
});

// finds the user by email and if there's a project saved then it will check if there is an thml,css, or js saved which we will load in the client app.js
app.get('/loadCode', checkAuthenticated, async (req, res) => {
  const email = req.user.email;

  try {
    const project = await Project.findOne({ email: email });
    if (project) {
      res.json({
        html: project.html ?? "",
        css: project.css ?? "",
        js: project.js ?? ""
      });
    } else {
      res.status(404).send('No code found');
    }
  } catch (e) {
    console.error('Error loading code:', e);
    res.status(500).send('Error loading code');
  }
});

// log in page
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs');
});

// handles the log in page and makes sure the email is stored after log in
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}), (req, res) => {
  req.session.email = req.user.email; 
  res.redirect('/');
});

// register page
app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs');
});

// registers user to the mongo database with a hashed password and handles redirecting
app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword
    });
    await user.save();
    res.redirect('/login');
  } catch (e) {
    console.log(e);
    res.redirect('/register');
  }
});

// handles logout and clears the email that was previously in a variable for the saving code function
app.delete('/logout', (req, res, next) => {
  req.logOut((err) => {
    if (err) { return next(err); }
    req.session.email = null;
    res.redirect('/login');
  });
});

// checks if the user is authenticated and if they're then they cannot go to the login and register pages
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    req.email = req.session.email; // Add this line
    return next();
  }
  res.redirect('/login');
}

// if they're authenticated then they can go to the main page
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});