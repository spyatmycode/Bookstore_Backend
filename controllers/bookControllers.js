import express from 'express';
import { Book } from '../models/bookModel.js';
import axios from 'axios'


//This controller is to get all the books for a single user

export const getAllBooks= async (req,res) => {

    try {

        const userId = req.userId._id

        const books = await Book.find({userId});
        return res.status(201).json({ count: books.length, books: books });

    } catch (error) {

        console.log(error);
        return res.status(500).send({ message: error.message });

    }

}

//This is to get a particular book by ID
export const getSingleBook =  async (req, res) => {

    try {

        const { id } = req.params

        const book = await Book.findById(id);
        return res.status(201).json({ book });

    } catch (error) {

        console.log(error);
        return res.status(500).send({ message: error.message });

    }



}

//This is add a new book to the database

export const addBook = async (req, res) => {
    try {

        const { title, author, publishYear, imageUrl } = req.body

        const userId =req.userId._id

        if (!title || !author || !publishYear) {
            return res.status(400).send({ message: "Please send all the required fields" })
        }

        const newBook = {
            title,
            author,
            publishYear,
            userId,
            imageUrl
        }

        const book = await Book.create(newBook);

       
        

        return res.status(201).send(book);



    } catch (error) {

        console.log(error)
        return res.status(500).send({ message: error.message })

    }
}

//This is to update the a particular in the database by ID

export const updateBook = async (req, res) => {
    try {

        const { title, author, publishYear, imageUrl } = req.body

        if (!title || !author || !publishYear) {
            return res.status(400).send({ message: "Please enter all the required fields" })
        }

        const { id } = req.params

        const result = await Book.findByIdAndUpdate(id, { title: title, author: author, publishYear: publishYear, imageUrl: imageUrl });

        if(!result){
            return res.status(400).send({message: "Book not found"})
        }

        return res.status(201).send({ message: "Book updated successfully!" });


    } catch (error) {

        console.log(error)
        return res.status(500).send({ message: error.message })

    }
}

//This is to delete a book

export const deleteBook = async (req, res)=>{

    try {

        const {id} = req.params;

        const result = await Book.findByIdAndDelete(id)

        if(!result){
            return res.status(404).send({ message:"Book not found"})
        }

        return res.status(200).send({ message:"Book deleted successfully"});
        

    } catch (error) {

        console.log(error.message);

        return res.status(404).send({ message:error.message})
        
    }

}



