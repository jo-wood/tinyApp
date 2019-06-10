'use-strict';

////   SERVER   ////
const express = require("express");
const app = express();
const PORT = 8080; 

////   HASH   ////
const bcrypt = require('bcrypt');
const cryptStore = require('./crypt-store');
const hashPass = cryptStore.hashPass;

////   PRIVATE DATABASES   ////
const users = cryptStore.users;
const urlDatabase = cryptStore.urlDatabase;

////  MIDDLEWARE   ////
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession( { name: 'session', keys: ['this is a key'] } ));
app.set('view engine', 'ejs');

////////////////////////////////////////////////////////////////
////                      HELPER FNs
///////////////////////////////////////////////////////////////

//TODO improve generateRandomString this to include ASCII 65-90 & 49-57

function generateRandomString(){
  let randomString = "";
  let randomASCII;
  for (let i = 0; i < 6; i++){
    randomASCII = Math.floor((Math.random() * 25) + 97);
    randomString += String.fromCharCode(randomASCII);
  }
  return randomString;
}

function deleteURL(key){
  for (let url in urlDatabase){
    if (url === key) {
      delete urlDatabase[key];
      return;
}}}

function checkIfUserExists(userVar, entryValue){
  switch (userVar){
  case 'id':
    for (let user in users) {
      if (entryValue === users[user].id) {
        return users[user];
        break;
      }
    }
  case 'email':
    for (let user in users) {
      if (entryValue === users[user].email) {
        return users[user];
        break;
      }
    }
  case 'default':
    return false;
    break;
  }
} 

function urlsForUser(userKey){
  let userUrls = {};
  for (let shortUrl in urlDatabase) {
    if (userKey === urlDatabase[shortUrl].userID) {
      userUrls[shortUrl] = urlDatabase[shortUrl].longURL;
    }
  }
return userUrls;
}

////////////////////////////////////////////////////////////////
////                       BROWSE
///////////////////////////////////////////////////////////////

app.get("/urls", (req, res) => {
  let userKey = checkIfUserExists('id', req.session.user_id);
  //return obj of this users shortURLs/longsURLs
  let userUrls = urlsForUser(userKey.id);
  let templateVars = {
    userName: userKey.email,
    urls: userUrls
  };
  res.render("urls_index", templateVars );
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL  = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

////////////////////////////////////////////////////////////////
////                       READ
///////////////////////////////////////////////////////////////

app.get("/urls/new", (req, res) => {
  let displayUser = checkIfUserExists('id', req.session.user_id);
  let requestingUser = displayUser.email;
  if (displayUser) {
    let userUrls = urlsForUser(displayUser.id);
    let templateVars = {
      userName: requestingUser,
      urls: userUrls
    };
  res.render("urls_new", templateVars);
  } else {
    res.render("login");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL;
  for (let key in urlDatabase) {
    if (key === shortURL) {
      longURL = urlDatabase[key].longURL
    }
  }
  let displayUser = checkIfUserExists('id', req.session.user_id);
  let userName = null;
  if (displayUser) {
    userName = displayUser.email;
  res.render("urls_show", {
    longURL,
    shortURL,
    userName
  });
  } else {
    res.render("login");
  }

});

////////////////////////////////////////////////////////////////
////                       EDIT
///////////////////////////////////////////////////////////////

//! note, as soon as server restarts, only hardwired users are retrievable 

app.post("/urls/new", (req, res) => {
  let displayUser = checkIfUserExists('id', req.session.user_id);
  if (displayUser) {
    let randomShortURL = generateRandomString();
    urlDatabase[randomShortURL] = {
      longURL: req.body.longURL,
      userID: displayUser.id
    }
  res.redirect('/urls');
  } else {
      res.status(403).send('Must be logged in');
  }
});

app.post("/urls/:shortURL/update", (req, res) => {
  let displayUser = checkIfUserExists('id', req.session.user_id);
  if (displayUser) {
    let selectedShortUrl = Object.keys(req.body)[0];
    let updatedLong = req.body[selectedShortUrl];
    urlDatabase[selectedShortUrl].longURL = updatedLong;
    res.redirect('/urls');
  } else {
    res.status(403).send('Must be logged in');
  }
});

////////////////////////////////////////////////////////////////
////                       AND
///////////////////////////////////////////////////////////////

////////////////   LOGIN ROUTES   //////////////////

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  let email = req.body.email;
  let storeUser = checkIfUserExists('email', email);
  let inputPassword = req.body.password;
  let verifyPassword = false;
  // if email not in db 
  if (!storeUser) {
    res.status(403).send('Uh oh, no user with that e-mail exists.');
  } else if (email === storeUser.email) {
      verifyPassword = bcrypt.compareSync(inputPassword, storeUser.password);
      if (verifyPassword) {
        req.session.user_id = storeUser.id;
        res.redirect('/urls');
      } else {
        res.status(403).send('Password is incorrect.');
      }
    }
}); 

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

////////////////   REGISTER ROUTES   //////////////////

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  let email = req.body.email;
  let inputPassword = hashPass(req.body.password);
  // if email or password are empty
  if (!email) {
    res.status(400).send('Invalid email.');
  }   
  if (!inputPassword) {
    res.status(400).send('Invalid password.');
  }
  // confirm no other user with same email
  let returnedUserId = checkIfUserExists('email', email);
  // generate new user and 'store' this user in users db
  if (!returnedUserId) {
    let id = generateRandomString();
    users[id] = {
      id: id,
      email: email,
      password: inputPassword
    }
    req.session.user_id = id;
    res.redirect('/urls');
  } else {
    res.status(400).send('A user with this email already exists.')
  }
});

////////////////////////////////////////////////////////////////
////                       DELETE
///////////////////////////////////////////////////////////////

app.post("/urls/:shortURL/delete", (req, res) => {
  // check which shortURL was flagged for delete
  let selectedShortUrl = Object.keys(req.body)[0];
  // find which user this shortURL belongs to
  let userForSelectedShort = urlDatabase[selectedShortUrl].userID;
  // confirm logged in user is infact the user for this shortURL
  let displayUser  = checkIfUserExists('id', req.session.user_id);
  let cookiesUserId = displayUser.id;
  if (userForSelectedShort === cookiesUserId) {
    deleteURL(selectedShortUrl);
    res.redirect('/urls');
  } else {
    res.status(400).send('Need to be logged in to delete a URL');
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});