const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require("axios");
const BASE_URL = "http://localhost:5000"; // replace with your server URL


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.setHeader('X-Custom-Header', 'Value'); // Set header before sending
    return res.status(200).send( JSON.stringify(books) );
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    res.setHeader('X-Custom-Header', 'Value'); // Set header before sending
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
    res.setHeader('X-Custom-Header', 'Value'); // Set header before sending
    if ( !req.body.username || !req.body.password ) {
        return res.status(422).end();
    }

    users.push( {
        "username": req.body.username,
        "password": req.body.password
      } );
      
      return res.status(200).send("ok");
});

// 10
async function getBooks() {
    try {
        const response = await axios.get(`${BASE_URL}/`);
        console.log("All books:", response.data);
    } catch (err) {
        console.error(err.message);
    }
}

// 11
async function getBookByISBN(isbn) {
    try {
        const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
        console.log(`Book details for ISBN ${isbn}:`, response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
    }
}

// 12
async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(`${BASE_URL}/author/${author}`);
        console.log(`Books by ${author}:`, response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
    }
}

// 13
async function getBookByTitle(title) {
    try {
        const response = await axios.get(`${BASE_URL}/title/${title}`);
        console.log(`Book with title "${title}":`, response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
    }
}


const res_books = getBooks();
console.log(res_books)
const res_bookbyisn = getBookByISBN(1);
console.log(res_bookbyisn)
const res_bookbyaurthur = getBooksByAuthor("Chinua Achebe");
console.log(res_bookbyaurthur)
const res_bookbyttl = getBookByTitle("Things Fall Apart");
console.log(res_bookbyttl)

module.exports.general = public_users;
