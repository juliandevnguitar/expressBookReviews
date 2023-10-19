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
  let promise = new Promise((resolve,reject) => {
      resolve(books);
  })

  return promise.then((response)=>res.status(200).json(response))
  .catch(err => res.status(400).json(err));
  
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  
  let promise = new Promise((resolve,reject) => {
    for (const key in books) {
        if (books[key].isbn === Number(ISBN)) {
            resolve(books[key]);
        }
    }
    
    reject("Book not found");
})
  return promise.then((response) => res.status(200).json(response))
  .catch(err => res.status(404).json(err));
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

  let promise = new Promise ((resolve,reject)=> {
      resolve(matchingBooks);
      reject("Author not Found");
  })

  if (matchingBooks.length > 0) {
    return promise.then(response => res.status(200).json(response))
    .catch(err => res.status(404).json(err));
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

  let promise = new Promise ((resolve) => {
      resolve(matchingBooks);
  })

  if (matchingBooks.length > 0) {
    return promise.then(response => res.status(200).json(response))
    .catch(err => res.status(404).json(err));
  } else {
    return res.status(404).json("Title not found");
  } 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  for (const key in books) {
      if (books[key].isbn === Number(isbn)) {
        return res.status(300).json(books[key].reviews);
      }
  }

  return res.status(404).json("Book not found under this isbn code, please searh another");
});

module.exports.general = public_users;
