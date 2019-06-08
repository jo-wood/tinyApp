//'use-strict';

////   SERVER   ////
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

////   HASH   ////
const bcrypt = require('bcrypt');
const cryptStore = require('./crypt-store');
const hashPass = cryptStore.hashPass;
// const hardwireUser1Pass = cryptStore.hardwireUser1Pass;
// const hardwireUser2Pass = cryptStore.hardwireUser2Pass;

////   PRIVATE DATABASES   ////
const users = cryptStore.users;
const urlDatabase = cryptStore.urlDatabase;


//// MIMIC USER COOKIES with session stored data ////
const currentUser = cryptStore.currentUser;

////  MIDDLEWARE   ////

const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession( { name: 'session', keys: ['this is a key'] } ));

app.set('view engine', 'ejs');







////////////////////////////////////////////////////////////////
////                      HELPER FNs
///////////////////////////////////////////////////////////////

//! improve this to include 65-90 & 49-57

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

} //checkIfUserExists

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
  
  //return obj of this users short/longs (key/value)
  let userUrls = urlsForUser(userKey.id);

  let templateVars = {
    userName: userKey.email,
    urls: userUrls
  };

  res.render("urls_index", templateVars );
});

//
//

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

  //! only checking that a user_id cookie exists
  //! would still need to validate if this user is who their
  //! cookie value says

    if (displayUser) {
    //return obj of this users short/longs (key/value)
    let userUrls = urlsForUser(displayUser.id);

    let templateVars = {
      userName: requestingUser,
      urls: userUrls
    };
    
    res.render("urls_new", templateVars);

    //? why does the label wrapping in ejs around input 
    //? cause a query '?' to get passed on my /urls/new 
    //? without the label it works 

    } else {
      res.render("login");
      }
});

//
//

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
  }

  res.render("urls_show", {
    longURL,
    shortURL,
    userName
  });
});





////////////////////////////////////////////////////////////////
////                       EDIT
///////////////////////////////////////////////////////////////



app.post("/urls/new", (req, res) => {

  // returns the users key (aka users id key for their obj)
  // handle hardwire cases first as they are also already hardwired in urlDatabase
  //! any session new users urls will be stored in their urls prop in the users db 

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

//
//

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

      // can't check per session since no true storage of new users in a database, but server still running and can 
      // therefore check users email in users since currentUser is temporarily stored here too (per registration code)

  } else if (email === storeUser.email) {
      verifyPassword = bcrypt.compareSync(inputPassword, storeUser.password);
    
      // if login user is a hardwired one, set them equal to the 'currentUser'

      if (verifyPassword) {
        req.session.user_id = storeUser.id;
        res.redirect('/urls');
      }

    } else {
      res.status(403).send('Password is incorrect.');
    }
}); 

app.post('/logout', (req, res) => {
  // hardwire the logout of 'cookies' user, but allow user to still exist in users db from registration
  // will only work for added users if server does not restart 
  
  currentUser.id = null;
  currentUser.email = null;
  currentUser.password = null;

  req.session = null;
  res.redirect('/urls');

});





////////////////   REGISTER ROUTES   //////////////////


app.get('/register', (req, res) => {
  res.render('register');
});

//
//

app.post('/register', (req, res) => {
  let email = req.body.email;
  let inputPassword = req.body.password;

  // if email or password are empty
  if (!email) {
    res.status(400).send('Invalid email.');
  }   
  if (!inputPassword) {
    res.status(400).send('Invalid password.');
  }


  // confirm no other user with same email
  let returnedUserId = checkIfUserExists('email', email);
  
  // generate new user
  if (!returnedUserId) {
    let id = generateRandomString();

    // set props for currentUser obj from cryptStore
    currentUser.id = id;
    currentUser.email = email;
    currentUser.password(inputPassword, hashPass);

    // 'store' current user in users db
    users[id] = currentUser;

    console.log(currentUser);
    console.log(users);
    
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


  let selectedShortUrl = Object.keys(req.body)[0];
  let userForSelectedShort = urlDatabase[selectedShortUrl].userID;

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