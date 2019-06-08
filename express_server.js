//'use-strict';

////   SERVER   ////
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

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
app.use(cookieSession( { name: 'session', keys: ['key1', 'key2'] } ));

app.set('view engine', 'ejs');
app.set('trust proxy', 1);



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
    let shortURLObj = urlDatabase[shortUrl];    
    
    if (userKey === shortURLObj.userID) {
      userUrls[shortUrl] = shortURLObj.longURL;
    }
  }
return userUrls;
}


////////////////////////////////////////////////////////////////
////                       BROWSE
///////////////////////////////////////////////////////////////

app.get("/urls", (req, res) => {

  let userKey = checkIfUserExists('id', req.session.user_id);
  
  let userId = userKey.id;
  //return obj of this users short/longs (key/value)
  let userUrls = urlsForUser(userId);

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


  let displayUser = checkIfUserExists('id', req.session.user_id);

  //! only checking that a user_id cookie exists
  //! would still need to validate if this user is who their
  //! cookie value says

  if (displayUser) {
    let randomShort = generateRandomString();
    urlDatabase[randomShort] = {
      longURL: req.body.longURL,
      userID: displayUser.id
    }
    res.redirect('/urls/' + randomShort);
  } else {
    res.render("login");
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

let password1 = users.userRandomID.hashPass("purple-monkey-dinosaur");
let password2 = users.user2RandomID.hashPass("dishwasher-funk");

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {

  let email = req.body.email;
  let storedUserId = checkIfUserExists('email', email);

  let inputPassword = req.body.password;
  let verifyPassword;

  
  //! first 2 are hard wired test case:
  if (storedUserId === 'userRandomID') {
    let password1 = users.userRandomID.hashPass("purple-monkey-dinosaur");
    console.log(password1);    
    verifyPassword = bcrypt.compareSync(inputPassword, password1);
  } else  if (storedUserId === 'user2RandomID') {
    let password2 = users.user2RandomID.hashPass("dishwasher-funk");
    console.log(password2);
    verifyPassword = bcrypt.compareSync(inputPassword, password2);
  } 
    // let hashedPassword = storedUserId.hashPass;
    // verifyPassword = bcrypt.compareSync(inputPassword, hashedPassword);
  


  // if email not in db 
  if (!storedUserId) {
    res.status(403).send('Uh oh, no user with that e-mail exists.')
  } 
  
  if (storedUserId) {
    if (verifyPassword) {
      req.session.user_id = storedUserId;
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

//
//

app.post('/register', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  // if email or password are empty
  if (!email) {
    res.status(400).send('Invalid email.');
  }   
  if (!password) {
    res.status(400).send('Invalid password.');
  }

  let returnedUserId = checkIfUserExists('email', email);
  
  if (!returnedUserId) {
    let id = generateRandomString();
    let hashedPassword = hashPass(password);

    users[id] = {
      id: id, 
      email: email,
      hashedPassword
    };

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

  let displayUser  = checkIfUserExists('id', req.cookies.user_id);
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