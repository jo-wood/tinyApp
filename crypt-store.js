const bcrypt = require('bcrypt');

const hashPass = function (password) {
  return bcrypt.hashSync(password, 10);
}


//* hardwire examples of password hashing since no true database yet

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: function (pass, cb) {
        return cb(pass);
    }
  },

  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: function (pass, cb) {
      return cb(pass);
    }
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

//* since server restarts, any new user data gets lost
//* even upon logout, that current session is completely removed

//// therefore store a currentUser object mimicing the storing of a cookie
//// by storing the currentUser into the users db
//// so that upon logging in again, that info will still be retrievable 

//! note, as soon as server restarts, only hardwired users are retrievable 

//* also note, any new user's urls will be stored in this cookie
//* in theory, also easier to store this session's user data in one obj 
//* rather than constantly iterating through the db obj for any req's made during just 1 session

// const currentUser = {
//   id : {
//     id: null,
//     email: null,
//     password: hashPass(),
//     urls = {}
//   }
// }


let password1 = users.userRandomID.password("purple-monkey-dinosaur", hashPass);
let password2 = users.user2RandomID.password("dishwasher-funk", hashPass);

console.log(bcrypt.compareSync("purple-monkey-dinosaur", password1)); //returned true
console.log(bcrypt.compareSync("purple-monkeynosaur", password1)); // returned  false
console.log(bcrypt.compareSync("dishwasher-funk", password2)); //returned true
console.log(bcrypt.compareSync("diwasher-funk", password2)); // returned  false

module.exports.hashPass = hashPass;
module.exports.users = users;
module.exports.urlDatabase = urlDatabase;

