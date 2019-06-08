const bcrypt = require('bcrypt');

const hashPass = function (password) {
  return bcrypt.hashSync(password, 10);
}


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

//* since server restarts, any new user data gets lost
//* even upon logout, that current session is completely removed

//// therefore store a currentUser object mimicing the storing of a cookie
//// by storing the currentUser into the users db
//// so that upon logging in again, that info will still be retrievable 

//! note, as soon as server restarts, only hardwired users are retrievable 


const currentUser = {
    id: null,
    email: null,
    password: ""
};



//* also note, any new user's urls will be stored in this cookie
//* in theory, also easier to store this session's user data in one obj 
//* rather than constantly iterating through the db obj for any req's made during just 1 session


//* hardwire examples of password hashing since no true database yet

// let hardwireUser1Pass = users.userRandomID.password;
// let hardwireUser2Pass = users.user2RandomID.password;


// console.log(bcrypt.compareSync("purple-monkey-dinosaur", hardwireUser1Pass)); //returned true
// console.log(bcrypt.compareSync("purple-monkeynosaur", hardwireUser1Pass)); // returned  false
// console.log(bcrypt.compareSync("dishwasher-funk", hardwireUser2Pass)); //returned true
// console.log(bcrypt.compareSync("diwasher-funk", hardwireUser2Pass)); // returned  false

module.exports.hashPass = hashPass;
module.exports.users = users;
module.exports.urlDatabase = urlDatabase;
module.exports.currentUser = currentUser;


