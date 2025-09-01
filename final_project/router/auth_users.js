const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

//returns boolean //write code to check is the username is valid
const isValid = (username)=> Boolean(username);

const authenticatedUser = (username,password)=>{ //returns boolean
    // this function assumes the validity of the parameters
    // this code can be optimized by better search algorithms but this is good for now

    
    for ( const user in users ) {
        if ( users[user].username === username && users[user].password === password ) {
            return true; 
        }
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

  if ( !isValid(username) || !isValid(password)){
    res.status(422).end();
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const accessToken = jwt.sign({ username: username }, "access", { expiresIn: 60 * 60 });
  req.session.authorization = { accessToken, username };
  
  return res.status(200).json({ message: "Login successful", token: accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    isbn = req.params.isbn
    if ( !isbn ) {
        return res.status(404).send("isbn not found")
    }
    
    const review = req.query.review;
    
    if (!req.session.authorization) {   
        return res.status(401).json({ message: "You must be logged in to post a review" });
    }
    
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
    
    const username = req.session.authorization.username;
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});   


regd_users.delete("/auth/review/:isbn", (req, res) => {
    isbn = req.params.isbn
    if ( !isbn ) {
        return res.status(404).send("isbn not found")
    }

    if (!req.session.authorization) {   
        return res.status(401).json({ message: "You must be logged in" });
    }
    const username = req.session.authorization.username;

    delete books[isbn].reviews[username];
    return res.status(204).end();
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
