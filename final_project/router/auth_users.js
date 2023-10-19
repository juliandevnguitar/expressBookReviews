const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let filtered_users = users.filter(user => user.username === username);
if (filtered_users.length > 0) {
    return false;
} else {
    return true;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
   let filtered_users = users.filter(user => user.username === username && user.password === password)
   
   if (filtered_users.length > 0) {
       return true;
   } else {
       return false;
   }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
}

if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }

  return res.status(200).send("User successfully logged in");
} else {
    return res.status(401).json({message: "Invalid Login. Check username and password"});
} 
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;
  
  let book_for_review;

  for (const key in books) {
      if (books[key].isbn === Number(isbn)) {
          book_for_review = books[key];
      }
  }
  let id = Object.keys(book_for_review.reviews).length + 1;

  let matchingReview;
  let matchingKey;

  
  for ( const key in book_for_review.reviews) {
        if (book_for_review.reviews[key].username === username){
            matchingReview = {username, review};
            matchingKey = key;
        }
      }
   if (matchingReview) {
       book_for_review.reviews[matchingKey] = {...book_for_review.reviews[matchingKey],review}
   } else {
       book_for_review.reviews[id] = {username,review}
   }

 
 

  return res.status(300).json(book_for_review.reviews);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    let book_to_delete;

   for (const key in books) {
       if (books[key].isbn === Number(isbn)) {
           book_to_delete = books[key];
       }
   }

   for (const key in book_to_delete.reviews) {
       if (book_to_delete.reviews[key].username === username) {
            delete (book_to_delete.reviews[key]);
       }
   }


  return res.status(200).json({message: "Review deleted", book_to_delete});  

});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;