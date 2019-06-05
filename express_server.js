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

app.post('/login', (req, res) => {
  let user = req.body.username;
  
  if (req.cookies){
    console.log('welcome back!' + user);
  } else {
    res.cookie(user);
  }
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase
  };

  let urls = templateVars.urls;

  res.render("urls_index", { urls });
});


app.get("/urls/new", (req, res) => {

  res.render("urls_new");
});


app.post("/urls", (req, res) => {
  let randomKey = generateRandomString();
  urlDatabase[randomKey] = req.body.longURL; 
  
  res.redirect(`/urls/${randomKey}`); 
});



app.get("/urls/:shortURL", (req, res) => {
  let {shortURL} = req.params;
  let longURL = urlDatabase[shortURL];

  res.render("urls_show", {
    longURL,
    shortURL
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





// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });


app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}!`);
});