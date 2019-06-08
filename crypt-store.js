const bcrypt = require('bcrypt');

const hashPass = function (password) {
  return bcrypt.hashSync(password, 10);
}
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: hashPass("purple-monkey-dinosaur")
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: hashPass("dishwasher-funk")
  }
};

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




module.exports.hashPass = hashPass;
module.exports.users = users;
module.exports.urlDatabase = urlDatabase;