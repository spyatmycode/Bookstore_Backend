import express from 'express';
import { Book } from '../models/bookModel.js';
import path from 'path'
import { addImageToFirebase, deleteImageFromFirebase } from '../config/firebaseConfig.js';
import { io } from '../index.js';
import axios from 'axios';
import { PAYSTACK_SECRET_LIVE, PAYSTACK_SECRET_TEST } from '../config/config.js';
import emailQueue from '../queues/emailQueue.js';
import { sendReceipt } from '../utils/sendReceipt.js';



//This controller is to get all the books for a single user

export const getAllBooks = async (req, res) => {

    try {

        const userId = req.userId._id

        const books = await Book.find({ userId });
        return res.status(201).json({ count: books.length, books: books });

    } catch (error) {

        console.log(error);
        return res.status(500).send({ message: error.message });

    }

}

export const getBookByBookId = async (req, res) => {
    const { bookId } = req.params;

    const reqBook = await Book.findOne({ bookId: bookId });

    return res.status(200).send({ message: "Book found", book: reqBook })
}

//This is to get a particular book by ID
export const getSingleBook = async (req, res) => {

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


    console.log("THE ADD BOOK controller was hit");


    try {

        console.log("multer??", req?.fileName);

        console.log(req.body);


        const { reference } = req.body

        console.log("Reference here", reference);

        if (!reference) throw Error("An error occured: payment reference not provided.");

        const confirmPayment = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_TEST}`
            }
        });

        const confirmPaymentResponse = await confirmPayment.data;

        console.log(confirmPaymentResponse);

        if (!confirmPaymentResponse.status) {

            return res.status(400).send({ message: "Payment failed, could not add book " })

        }

        const { id, amount, metadata } = confirmPaymentResponse?.data;

        console.log("This is the meta data from paystack in the book controller", metadata);

        const { title, author, publishYear, bookId } = metadata.book



        const file = req.file

        const userId = req.userId._id

        if (!title || !author || !publishYear) {
            console.log({
                author, title, publishYear
            });
            return res.status(400).send({ message: "Please send all the required fields" })
        }


        const fileName = `${Date.now()}${path.extname(req.file.originalname)}`

        const imageDownLoadUrl = await addImageToFirebase(file.buffer, fileName)

        const newBook = {
            title,
            author,
            publishYear,
            userId,
            bookId,
            transactionId: id,
            image: { imageDownLoadUrl, fileName }
        }



        const book = await Book.create(newBook);

        // {name, author, publishYear, price, downloadUrl} 

       /*  await emailQueue.add({
            recipient: confirmPaymentResponse?.data?.customer?.email,
            content: {
                name: title, publishYear, author, price: (confirmPaymentResponse?.data?.amount / 100), downloadUrl: imageDownLoadUrl
            }
        }); */

        

        await sendReceipt(confirmPaymentResponse?.data?.customer?.email, {name:title, publishYear, author,price: (confirmPaymentResponse?.data?.amount / 100), downloadUrl:imageDownLoadUrl});



        return res.status(201).send(book);



    } catch (error) {

        console.log(error)
        return res.status(500).send({ message: error.message })

    }
}

//This is to update the a particular in the database by ID

export const updateBook = async (req, res) => {
    try {

        const { title, author, publishYear, previousImageName, previousImageURL } = req.body

        console.log(previousImageURL);


        console.log(previousImageName);


        const file = req.file

        console.log("messup??", file);

        file && console.log("There is file");






        if (!title || !author || !publishYear) {
            return res.status(400).send({ message: "Please enter all the required fields" })
        }

        const fileName = file ? `${Date.now()}${path.extname(req.file.originalname)}` : previousImageName

        const imageDownLoadUrl = file ? await addImageToFirebase(file.buffer, fileName) : previousImageURL

        console.log(imageDownLoadUrl);


        const { id } = req.params

        console.log("Book yi nii", id);



        const bookToBeUpdated = await Book.findByIdAndUpdate(id, { title, author, publishYear, image: { imageDownLoadUrl, fileName } })

        if (!bookToBeUpdated) throw Error("Book does not exist")

        const deleteImage = file && previousImageURL && previousImageURL !== null && await deleteImageFromFirebase(previousImageName);

        return res.status(201).send({ message: "Book updated successfully!" });


    } catch (error) {

        console.log(error)
        return res.status(500).send({ message: error.message })

    }
}

//This is to delete a book

export const deleteBook = async (req, res) => {

    try {

        const { id } = req.params;
        const { imageFileName } = req.query

        const result = await Book.findByIdAndDelete(id)

        await deleteImageFromFirebase(imageFileName)

        if (!result) {
            return res.status(404).send({ message: "Book not found" })
        }

        return res.status(200).send({ message: "Book deleted successfully" });


    } catch (error) {

        console.log(error.message);

        return res.status(404).send({ message: error.message })

    }

}



