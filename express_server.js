//'use-strict';

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hey hello!");
});


app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase
  };

  let urls = templateVars.urls;

  res.render("urls_index", { urls });
});

app.get("/urls/:shortURL", (req, res) => {
  let shortURL =  req.params.shortURL;
  let longURL = urlDatabase[shortURL];

  res.render("urls_show", 
  {
    shortURL,
    longURL
  });
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}!`);
});