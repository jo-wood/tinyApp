# TinyApp Project 

## Project Description 

#### Goal 

This web app uses NodeJS to  allow users to shorten long URLs much like bit.ly.

This demo app runs an HTTP Server that handles requests from the browser by incorporating the express framework.

## Explore tinyApp

!['Main Page (not logged in)'](https://github.com/jo-wood/tinyApp/blob/master/docs/urls_not_logged_in.png)
!['Login Page'](https://github.com/jo-wood/tinyApp/blob/master/docs/login_pg.png)
!['Main Page (logged in)'](https://github.com/jo-wood/tinyApp/blob/master/docs/main_img.png)

**DEPENDENCIES:**

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

**GETTING STARTED:**

- Install all dependencies (using the `npm install` command)
- Run the development web server using the `node express_server.js` command
  - Open the browser on `http://localhost:8080/urls`
    - *note the port set is 8080*

### User Stories

As an avid twitter poster, I want to be able to shorten links so that I can fit more non-link text in my tweets.

I want to know that my password data is secure, and using hashing for verification - I don't ANYONE to have access to my password, even the database.  

As a twitter reader, I want to be able to visit sites via shortened links, so that I can read interesting content.

### Features to Try

- Site Header:
  - if a user is logged in, the header shows:
    - the user's email
    - a logout button which makes a POST request to /logout
  - if a user is not logged in, the header shows:
    - a link to the login page (/login)
    - a link to the registration page (/register)

- Register!
  - input an email and password and subsequently use this info to login to the app!
  - **NOTE! This will login will only last for one session as this app is not currently using an external database

- Login
  - login using these hardwired accounts to see the functionality of adding a new short URL that stays loaded upon logging off through cookie session - log back in to see!
    - email: user@example.com / password: "purple-monkey-dinosaur"
    - email: user2@example.com / password: "dishwasher-funk"

- **Click the `tinyApp` logo to return to the main urls page at any point!**

- **Click the *shortURL* to take you to that shortURLs main page
  - From here, **click the shortURL to take you to the real long form link!** Test that your new tinyURL works in the browser!

!['Update the URL Link'](https://github.com/jo-wood/tinyApp/blob/master/docs/short_url_page.png)


### Additional Features

- `GET /urls`

  - if user is logged in:
    - returns HTML with:
    - the site header (see Display Requirements above)
    - a list (or table) of URLs the user has created, each list item containing:
      - a short URL 
      - the short URL's matching long URL
      - an edit button which makes a GET request to /urls/:id
      - a delete button which makes a POST request to /urls/:id/delete
    - a link to "Create a New Short Link" which makes a GET request to /urls/new
  - if user is not logged in:
    - returns HTML with a relevant error message

- GET /urls/new

- if user is logged in:
  - returns HTML with:
  - the site header (see Display Requirements above)
- a form which contains:
  - a text input field for the original (long) URL
  - a submit button which makes a POST request to /urls
- if user is not logged in:
  - redirects to the /login page

- GET /urls/:id

- if user is logged in and owns the URL for the given ID:
  - returns HTML with:
  - the site header (see Display Requirements above)
  - the short URL (for the given ID)
  - a form which contains:
  - the corresponding long URL
  - an update button which makes a POST request to /urls/:id
- if a URL for the given ID does not exist:
  - (Minor) returns HTML with a relevant error message
- if user is not logged in:
  - returns HTML with a relevant error message
  - if user is logged it but does not own the URL with the given ID:
  - returns HTML with a relevant error message

- GET /u/:id

- if URL for the given ID exists:
  - redirects to the corresponding long URL

- POST /urls

- if user is logged in:
- generates a short URL, saves it, and associates it with the user
- redirects to /urls/:id, where :id matches the ID of the newly saved URL **changed this to redirect to main urls**
- if user is not logged in:
  - (Minor) returns HTML with a relevant error message

- POST /urls/:id

- if user is logged in and owns the URL for the given ID:
  - updates the URL
  - redirects to /urls
- if user is not logged in:
  - (Minor) returns HTML with a relevant error message
  - if user is logged it but does not own the URL for the given ID:
  - (Minor) returns HTML with a relevant error message

- POST /urls/:id/delete
  - if user is logged in and owns the URL for the given ID:
  - deletes the URL
  - redirects to /urls
- if user is not logged in:
  - (Minor) returns HTML with a relevant error message
  - if user is logged it but does not own the URL for the given ID:
  - (Minor) returns HTML with a relevant error message

- GET /login

- if user is logged in:
  - (Minor) redirects to /urls
- if user is not logged in:
  - returns HTML with:
  - a form which contains:
  - input fields for email and password
  - submit button that makes a POST request to /login

- GET /register

- if user is logged in:
  - (Minor) redirects to /urls
- if user is not logged in:
  - returns HTML with:
  - a form which contains:
  - input fields for email and password
  - a register button that makes a POST request to /register

- POST /login

- if email and password params match an existing user:
  - sets a cookie
  - redirects to /urls
- if email and password params don't match an existing user:
  - returns HTML with a relevant error message
  - POST /register

- if email or password are empty:
  - returns HTML with a relevant error message
- if email already exists:
  - returns HTML with a relevant error message

- otherwise:
  - creates a new user
  - encrypts the new user's password with bcrypt
  - sets a cookie
  - redirects to /urls

- POST /logout

  - deletes cookie
  - redirects to /urls