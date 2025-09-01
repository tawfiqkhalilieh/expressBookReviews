const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();




// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).send( JSON.stringify(books) );
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  if ( !req.params.isbn || !books[parseInt(req.params.isbn)] ) {
    return res.status(404).send("isbn not found")
  }
  return res.status(200).send( JSON.stringify( books[parseInt(req.params.isbn)] ) );
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    res.setHeader('X-Custom-Header', 'Value'); // Set header before sending
    const author = req.params.author;

    if ( !author ) {
        res.status(422).end();
        return;
    }

    const results = [];
    

    Object.keys(books).forEach(key => {
        if ( books[key].author === author ) {
            results.push(books[key]);
        }
    });

    if ( results.length == 0 ) {
        res.status(404).send(`Unable to find books written by ${author}`);
        return;
    } else {
        res.status(200).send(results);
        return;
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    res.setHeader('X-Custom-Header', 'Value'); // Set header before sending

    const title = req.params.title;

    if ( !title ) {
        res.status(422).end();
        return;
    }

    Object.keys(books).forEach(key => {
        if ( books[key].title === title ) {
           return res.status(200).send( JSON.stringify(books[key]) );
        }
    });


  //Write your code here
  return res.status(404).json(`Couldn't find a book with the title ${title}`);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    res.setHeader('X-Custom-Header', 'Value'); // Set header before sending
    //Write your code here
    if ( !req.params.isbn || !books[parseInt(req.params.isbn)] ) {
        return res.status(404).send("isbn not found")
    }

    return res.status(200).send( JSON.stringify( books[parseInt(req.params.isbn)].reviews ) );
});

public_users.post("/register/", (req,res) => {
    if ( !req.body.username || !req.body.password ) {
        return res.status(422).end();
    }

    users.push( {
        "username": req.body.username,
        "password": req.body.password
      } );
      
      return res.status(200).send("ok");
});



module.exports.general = public_users;
