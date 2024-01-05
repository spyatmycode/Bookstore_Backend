import express from 'express';
const router = express.Router();
import { addBook, deleteBook, getAllBooks, getSingleBook,updateBook } from '../controllers/bookControllers.js';

import { requireAuth } from '../middlewares/requireAuth.js';
import { upload } from '../middlewares/multer.js';

//This will require authentication for all the routes
router.use(requireAuth);
router.use(upload.single("image"))

//This is to fetch all the books

router.get('/', getAllBooks)

//This is to get a particular book by ID
router.get('/:id', getSingleBook)

//This is add a new book to the database

router.post('/' ,addBook)


//This is to update the a particular in the database by ID

router.put('/:id',updateBook)

//This route is to delete a book

router.delete('/:id', deleteBook)


export default router