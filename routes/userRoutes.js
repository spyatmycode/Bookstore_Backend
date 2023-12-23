import express from 'express';
import { createUser, getUserData, loginUser } from '../controllers/userController.js';
import { createPayStackCustomer, getPayStackCustomer } from '../middlewares/payStack.js';
import { requireAuth } from '../middlewares/requireAuth.js';


const router = express.Router();

//To create a new user

router.post('/signup',createPayStackCustomer ,createUser);

router.post('/login',loginUser);

router.get('/', requireAuth ,getUserData);




export default router;