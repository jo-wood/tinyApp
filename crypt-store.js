const bcrypt = require('bcrypt');

const hashPass = function (password) {
  return bcrypt.hashSync(password, 10);
};

//* hardwire examples of password hashing since no true database yet

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: hashPass('purple-monkey-dinosaur')
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: hashPass('dishwasher-funk')
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

//* since server restarts, any new user data gets lost
//* even upon logout, that current session is completely removed

//// therefore store a currentUser object mimicing the storing of a cookie
//// by storing the currentUser into the users db
//// so that upon logging in again, that info will still be retrievable 