const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
      return res.status(400).json("Not able to register without password or username,please complete the form")
  }

  
  if (!isValid(username)) {
      return res.status(400).json("Username not available, please choose another");
  } else {
    users.push({username: username, password: password})
    return res.status(300).json({message: `Register succesful ${username} added`});
  }

  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here

  return res.status(300).json((books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;

  return res.status(300).json(books[ISBN]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const matchingBooks = [];

  for (const key in books) {
    if (books.hasOwnProperty(key) && books[key].author === author) {
      matchingBooks.push(books[key]);
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json("Author not found");
  }   
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const matchingBooks = [];

  for (const key in books) {
    if (books.hasOwnProperty(key) && books[key].title === title) {
      matchingBooks.push(books[key]);
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json("Title not found");
  } 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  return res.status(300).json(books[isbn].reviews);
});

module.exports.general = public_users;
