import express from 'express';
import { createPayStackCustomer, getPayStackCustomer, validatePayStackCustomer } from '../controllers/payStack.js';
import { requireAuth } from '../middlewares/requireAuth.js';



const router = express.Router();

//To create a new paystack customer.
router.post('/customer', createPayStackCustomer);

//To validate the customer

router.post('/validate', requireAuth,validatePayStackCustomer)

//To get a single paystack customer

router.get('/customer', getPayStackCustomer)

export default router;