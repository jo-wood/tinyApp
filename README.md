# TinyApp Project 

## Project Description 

#### Goal 

This web app uses NodeJS to  allow users to shorten long URLs much like bit.ly.

This demo app runs an HTTP Server that handles requests from the browser by incorporating the express framework.

## Explore tinyApp

!['Main Page (not logged in)'](https://github.com/jo-wood/tinyApp/blob/master/docs/urls_not_logged_in.png)
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

- **Site Header:**
  - if a user is logged in, the header shows:
    - the user's email
    - a logout button which makes a POST request to /logout
  - if a user is not logged in, the header shows:
    - a link to the login page (/login)
    - a link to the registration page (/register)

- **Register!**
  - input an email and password and subsequently use this info to login to the app!
  - **NOTE! This will login will only last for one session as this app is not currently using an external database

- **Login**
  - login using these hardwired accounts to see the functionality of adding a new short URL that stays loaded upon logging off through cookie session - log back in to see!
    - email: user@example.com / password: "purple-monkey-dinosaur"
    - email: user2@example.com / password: "dishwasher-funk"
  - an error message will be sent to the user if:
    - if email does not match any registered users
    - if the password is incorrect based on the user email (this will render first if any issue with inputs)

!['Login Page'](https://github.com/jo-wood/tinyApp/blob/master/docs/login_pg.png)

- **Click the `tinyApp` logo to return to the main urls page at any point!**

- **Click the *shortURL* to take you to that shortURLs main page
  - From here, **click the shortURL to take you to the real long form link!** Test that your new tinyURL works in the browser!

!['Update the URL Link'](https://github.com/jo-wood/tinyApp/blob/master/docs/short_url_page.png)

### Additional Features

- **Once logged in**:
  - click on `cut new url` to see the app's main functionality - turning your long url of choice into a *tiny* url link
  - once submitted, user will be redirected to their homepage and see their newly created shortURL & the associated longURL

- *Note: only the user that created the  short / long URL has access to this route (/urls and urls/shortURL page)*

  - the user can update the longURL link through the 'Edit Source URL' option on the main page. 
    - this edit source will redirect the user to the page that pertains strictly to that short & long URL
    - no one accept the logged in user can access this edit/update page
  - the user may also **delete** the short URL on the main page through the `remove` button

- **Logging out**
  - the user may log out, and any newly created URL's will remain on their homepage upon logging in (*NOTE: this will only occur if the server is not restarted as this app is not in production mode)

- The shortURL is available to any user that access its `/u/shortURL` link within the browser.
  - This route will redirect any user to the intended longer URLs true domain & route
