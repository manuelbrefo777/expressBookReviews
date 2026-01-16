const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      // Check if the user already exists
      const exists = users.filter((user) => user.username === username);
      
      if (exists.length === 0) {
        // Add new user to the users array
        users.push({ "username": username, "password": password });
        return res.status(200).json({ message: "User successfully registered. Now you can login" });
      } else {
        return res.status(404).json({ message: "User already exists!" });
      }
    }
  
    // Error if username or password is missing
    return res.status(400).json({ message: "Unable to register user. Provide username and password." });
});

// Get the book list available in the shop using Async-Await
public_users.get('/', async function (req, res) {
    try {
      // Simulating an asynchronous operation (like a database fetch)
      const getBooks = new Promise((resolve, reject) => {
        resolve(books);
      });
  
      const bookList = await getBooks;
      res.status(200).send(JSON.stringify(bookList, null, 4));
    } catch (error) {
      res.status(500).json({ message: "Error retrieving books" });
    }
});

// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    // Create a new Promise to handle the search asynchronously
    const getBookByISBN = new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject("Book not found");
      }
    });
  
    // Handle the Promise resolution/rejection
    getBookByISBN
      .then((book) => {
        res.status(200).send(JSON.stringify(book, null, 4));
      })
      .catch((error) => {
        res.status(404).json({ message: error });
      });
  });
  
// Get book details based on author using Async-Await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    
    try {
      // Create a promise to simulate an asynchronous lookup
      const getBooksByAuthor = new Promise((resolve, reject) => {
        const keys = Object.keys(books);
        const filtered_books = keys
          .filter(key => books[key].author === author)
          .map(key => ({ isbn: key, ...books[key] }));
  
        if (filtered_books.length > 0) {
          resolve(filtered_books);
        } else {
          reject("Author not found");
        }
      });
  
      const result = await getBooksByAuthor;
      res.status(200).send(JSON.stringify(result, null, 4));
    } catch (error) {
      res.status(404).json({ message: error });
    }
});

// Get book details based on title using Async-Await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
  
    try {
      // Create a promise to handle the search asynchronously
      const getBooksByTitle = new Promise((resolve, reject) => {
        const keys = Object.keys(books);
        const filtered_books = keys
          .filter(key => books[key].title === title)
          .map(key => ({ isbn: key, ...books[key] }));
  
        if (filtered_books.length > 0) {
          resolve(filtered_books);
        } else {
          reject("Title not found");
        }
     });
  
      const result = await getBooksByTitle;
      res.status(200).send(JSON.stringify(result, null, 4));
    } catch (error) {
      res.status(404).json({ message: error });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Retrieve the ISBN from parameters
    const book = books[isbn];    // Find the book by its ISBN key
  
    if (book) {
      // Return only the reviews object of the book
      return res.status(200).send(JSON.stringify(book.reviews, null, 4));
    } else {
      // Return an error if the book doesn't exist
      return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
