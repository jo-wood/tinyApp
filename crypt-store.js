const bcrypt = require('bcrypt');

const hashPass = function (password) {
  return bcrypt.hashSync(password, 10);
}

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    hashPass
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    hashPass
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

//* hardwire examples of password hashing:

// let password1 = users.userRandomID.hashPass("purple-monkey-dinosaur");
// let password2 = users.user2RandomID.hashPass("dishwasher-funk");

// console.log(bcrypt.compareSync("purple-monkey-dinosaur", password1)); //returned true
// console.log(bcrypt.compareSync("purple-monkeynosaur", password1)); // returned  false
// console.log(bcrypt.compareSync("dishwasher-funk", password2)); //returned true
// console.log(bcrypt.compareSync("diwasher-funk", password2)); // returned  false

module.exports.hashPass = hashPass;
module.exports.users = users;
module.exports.urlDatabase = urlDatabase;

