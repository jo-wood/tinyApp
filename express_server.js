//'use-strict';

const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');

const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser());

app.set('view engine', 'ejs');


//    DATABASES:   //

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  "lsm5xK": {
      longURL: "http://www.google.com",
      userID: "user2RandomID"
  }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

//*************************************************************/
//**                        HELPER FNs
//*************************************************************/

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

function findURL(key){
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

  let userKey = checkIfUserExists('id', req.cookies.user_id);
    
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
  let { longURL } = urlDatabase[shortURL];
  res.redirect(longURL);
});

////////////////////////////////////////////////////////////////
////                       READ
///////////////////////////////////////////////////////////////

app.get("/urls/new", (req, res) => {
  let userKey = checkIfUserExists('id', req.cookies.user_id)

    if (userKey) {
    //return obj of this users short/longs (key/value)
    let userUrls = urlsForUser(userKey.id);

    let templateVars = {
      userName: userKey.email,
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

  console.log(urlDatabase);
    
  let displayUser = checkIfUserExists('id', req.cookies.user_id);
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
  let randomShort = generateRandomString();

  Object.assign(urlDatabase, { randomShort: {
    longURL: req.body.longURL,
    userID: req.cookies.user_id
  }});


  res.redirect(`/urls/${randomShort}`);
});

//
//

app.post("/urls/:shortURL/update", (req, res) => {
  let urlForUpdate = req.body;
  let shortURL = Object.keys(urlForUpdate);
  let updatedLong = urlForUpdate[shortURL];

  urlDatabase[shortURL].longURL = updatedLong;
  res.redirect('/urls');
});



////////////////////////////////////////////////////////////////
////                       AND
///////////////////////////////////////////////////////////////


////////////////   LOGIN ROUTES   //////////////////

app.get('/login', (req, res) => {
  res.render('login', { users });
});

app.post('/login', (req, res) => {

  let email = req.body.email;
  let password = req.body.password;

  let storedUser = checkIfUserExists('email', email);
  let matchPassword = storedUser.password;
  let userId = storedUser.id;

  // if email or password are empty or email exists in db

  if (email !== storedUser.email) {
    res.status(403).send('Uh oh, no user with that e-mail exists.')
  } 
  
  if (email === storedUser.email) {
    if (password === matchPassword ) {
      res.cookie('user_id', userId);
      res.redirect('/urls');
    } else {
      res.status(403).send('Password is incorrect.');
      } 
  } 
}); 

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
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

  let checkEmail = checkIfUserExists('email', email);
  
  if (!checkEmail) {
    let id = generateRandomString();
    users[id] = {
      id: id, 
      email: email,
      password: password
    };

    res.cookie('user_id', id);
    res.redirect('/urls');
  } else {
    res.status(400).send('A user with this email already exists.')
  }

});


////////////////////////////////////////////////////////////////
////                       DELETE
///////////////////////////////////////////////////////////////

app.post("/urls/:shortURL/delete", (req, res) => {

  let displayUser;
  if (req.cookies.user_id) {
    displayUser = checkIfUserExists('id', req.cookies.user_id);
  }

  let shortURL = Object.keys(req.body)[0];
  findURL(shortURL);

  res.redirect('/urls');
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});