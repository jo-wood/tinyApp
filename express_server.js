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

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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

function checkIfEmailExists(userVar, entryValue){
  for (let user in users) {
    switch (userVar){

    case 'id':
      if (entryValue === users[user].id) {
      return true;
      break;
      }

    case 'email':
      if (entryValue === users[user].email) {
      return true;
      break;
      }

    case 'default':
      return false;
      break;
  }
}
}//checkIfEmailExists


app.post('/login', (req, res) => {
  let user = req.body.username;
  
  if (user === req.cookies.username) {
    console.log('welcome back!' + user);
  } else {
    res.cookie('username', user);
    res.redirect('/urls');
  }
});

app.get("/urls", (req, res) => {
  let templateVars = {
    username: req.cookies.username,
    urls: urlDatabase
  };

  let {urls, username} = templateVars;  


  res.render("urls_index", { urls , username });
});


app.get("/urls/new", (req, res) => {
let username = req.cookies.username;
  res.render("urls_new", username);
});


app.post("/urls", (req, res) => {
  let randomKey = generateRandomString();
  urlDatabase[randomKey] = req.body.longURL; 
  
  res.redirect(`/urls/${randomKey}`); 
});



app.get("/urls/:shortURL", (req, res) => {
  let {shortURL} = req.params;
  let longURL = urlDatabase[shortURL];
  let username = req.cookies.username;

  res.render("urls_show", {
    longURL,
    shortURL,
    username
  });
});

app.post("/urls/:shortURL/delete", (req, res) => {
  console.log(Object.keys(req.body));
  
  let shortURL = Object.keys(req.body)[0];
  findURL(shortURL);
  
  console.log(urlDatabase);

  res.redirect('/urls');
});

app.get("/u/:shortURL", (req, res) => {

  let longURL = urlDatabase[shortURL];
    
  res.redirect(longURL);
});

app.post("/urls/:shortURL/update", (req, res) => {
  let urlForUpdate = req.body;
  let shortURL = Object.keys(urlForUpdate);
  let updatedLong = urlForUpdate[shortURL];

  urlDatabase[shortURL] = updatedLong;
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  console.log('User logged out');
  res.clearCookie('username');
  res.redirect('/urls');
});


app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let id = generateRandomString();

//* if email or password are empty or email exists in db

  if (!email || !password) {
    res.status(400).send('Invalid email or password!');
  } else if (checkIfEmailExists('email', email)) {
    res.status(400).send('A user with this email already exists.');
  } else {
    users[id] = {
      id,
      email,
      password
    };

    res.cookie('user_id', id);
    res.redirect('/urls');
  }

});


app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}!`);
});