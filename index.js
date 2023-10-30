
const express = require('express');
const app = express();
const joi = require('joi');
const mongoose = require('mongoose');

const Book = require('./Models/Book'); 
app.use(express.json());
require('dotenv').config();
const port = process.env.PORT; 

// Define a route for saving book details using a POST request
app.post("/addBookDetails", async (req, res) => {
    // Validate the request body using Joi
    const isValid = joi.object({
        title: joi.string().required(),
        author: joi.string().required(),
        summary: joi.string().min(20).max(1000).required()
    }).validate(req.body);

    // If validation fails, return a 400 Bad Request response
    if (isValid.error) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid input',
            data: isValid.error.details,
        });
    }

    try {
        // Create a new Book instance with data from the request body
        const newBook = new Book({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
        });

        // Save the new book to the database
        const savedBook = await newBook.save();
        console.log(savedBook);

        // Return a 201 Created response with the saved book details
        res.status(201).json({
            status: 201,
            message: 'Book details saved successfully',
            data: savedBook,
        });
    } catch (err) {
        console.error(err);
        // Handle internal server errors and return a 500 Internal Server Error response
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
        });
    }
});

// Define a route for retrieving all books using a GET request
app.get("/allBooks", async (req, res) => {
    try {
        // Retrieve all books from the database using the 'find' method
        const allBooks = await Book.find();

        // Return a 200 OK response with the retrieved books
        res.status(200).json({
            status: 200,
            message: 'All books retrieved successfully',
            data: allBooks,
        });
    } catch (err) {
        console.error(err);
        // Handle internal server errors and return a 500 Internal Server Error response
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
        });
    }
});

// Define a route for retrieving a book by its ID using a GET request
app.get("/Book/:id", async (req, res) => {
    const { id } = req.params; // Extract the "id" from the request parameters

    // Validate the "id" as a string
    const isValid = joi.object({
        id: joi.string().required(),
    }).validate({ id });

    if (isValid.error) {
        // If validation fails, return a 400 Bad Request response
        return res.status(400).json({
            status: 400,
            message: 'Invalid input',
            data: isValid.error.details,
        });
    }

    try {
        // Find a book by its ID using the 'findById' method
        const book = await Book.findById(id);

        if (book !== null) {
            // Return a 200 OK response with the retrieved book
            res.status(200).json({
                status: 200,
                message: 'Book retrieved successfully',
                data: book,
            });
        } else {
            // Return a 404 Not Found response if the book is not found
            res.status(404).json({
                status: 404,
                message: 'Book not found',
            });
        }
    } catch (err) {
        console.error(err);
        // Handle internal server errors and return a 500 Internal Server Error response
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
        });
    }
});

// Define a route for deleting a book by its ID using a DELETE request
app.delete("/DeleteBook/:id", async (req, res) => {
    const { id } = req.params; // Extract the "id" from the request parameters

    // Validate the "id" as a string
    const isValid = joi.object({
        id: joi.string().required(),
    }).validate({ id });

    if (isValid.error) {
        // If validation fails, return a 400 Bad Request response
        return res.status(400).json({
            status: 400,
            message: 'Invalid input',
            data: isValid.error.details,
        });
    }

    try {
        // Find a book by its ID and delete it using the 'findByIdAndDelete' method
        const DeletedBook = await Book.findByIdAndDelete(id);
        console.log(DeletedBook);

        if (DeletedBook !== null) {
            // Return a 200 OK response with the deleted book
            res.status(200).json({
                status: 200,
                message: 'Book deleted successfully',
                data: DeletedBook,
            });
        } else {
            // Return a 404 Not Found response if the book is not found
            res.status(404).json({
                status: 404,
                message: 'Book not found',
            });
        }
    } catch (err) {
        console.error(err);
        // Handle internal server errors and return a 500 Internal Server Error response
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: err
        });
    }
});

// Define a route for updating book details using a PUT request
app.put('/editBook/:id', async (req, res) => {
    const { id } = req.params; // Extract the book ID from the request parameters

    // Validate the request body using Joi
    const isValid = joi.object({
        title: joi.string().required(),
        author: joi.string().required(),
        summary: joi.string().min(20).max(1000).required()
    }).validate(req.body);

    if (isValid.error) {
        // If validation fails, return a 400 Bad Request response
        return res.status(400).json({
            status: 400,
            message: 'Invalid input',
            data: isValid.error.details,
        });
    }

    // Define the update operation outside of the try block
    const updateOperation = {
        title: req.body.title,
        author: req.body.author,
        summary: req.body.summary,
    };

    try {
        // Find the book by ID and update its details using 'findByIdAndUpdate'
        const updatedBook = await Book.findByIdAndUpdate(id, updateOperation, { new: true });

        if (updatedBook) {
            // Return a 200 OK response with the updated book
            res.status(200).json({
                status: 200,
                message: 'Book details updated successfully',
                data: updatedBook,
            });
        } else {
            // Return a 404 Not Found response if the book is not found
            res.status(404).json({
                status: 404,
                message: 'Book not found',
            });
        }
    } catch (err) {
        console.error(err);
        // Handle internal server errors and return a 500 Internal Server Error response
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: err,
        });
    }
});

// Connect to MongoDB using the provided URI
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB is connected!"))
    .catch((err) => console.log(err));

// Start the server and listen on the specified port
app.listen(port, () => console.log('Server is running at', port));


