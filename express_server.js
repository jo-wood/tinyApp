//'use-strict';

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
  extended: true
}));

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
  console.log(urlDatabase);
  
  res.redirect(`/urls/${randomKey}`); 
});


app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
  urlDatabase[shortURL] = longURL;

  res.render("urls_show", {
    longURL,
    shortURL
  });
});


app.get("/u/:shortURL", (req, res) => {

  let longURL = urlDatabase[shortURL];
    
  res.redirect(longURL);
});


// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });


app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}!`);
});