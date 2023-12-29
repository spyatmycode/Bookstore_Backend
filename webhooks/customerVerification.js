//Webhooks are basically just routes that are primartly used for event listening


import express from 'express';
import crypto from 'crypto'
const router = express.Router()
import { io } from '../index.js';
import { sendVerificationSms } from '../utils/sendVerificationMessage.js';
import { User } from '../models/userModel.js';
import { PAYSTACK_SECRET_LIVE } from '../config.js';

const allowContinuation = (req) => {
    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_LIVE).update(JSON.stringify(req.body)).digest('hex');

    //TODO: remove the comment below
    if (hash !== req.headers['x-paystack-signature']) {
        throw new Error("Invalid signature! Request is unauthorized")
    }

}



router.post('/customer-verification', async (req, res) => {

    allowContinuation(req)


    try {
        const { event, data } = req.body;


        console.log();

        switch (event) {
            case "customeridentification.success":
                {
                    

                    res.sendStatus(200)

                    

                    const customer = await User.findOne({ payStackCustomerID: data?.customer_code }).select('first_name last_name')

                    if (!customer) throw Error("customer not found")


                    const messageContent = [
                        { to: '2347051807727', message: `Customer (${customer?.first_name} ${customer?.last_name}) with code ${data?.customer_code} has been verified`, sender_name: 'Sendchamp', route: 'dnd' },
                        { to: '2347051807727', message: `Customer(${customer?.first_name} ${customer?.last_name}) with code ${data?.customer_code} has failed verification because ${data?.reason}`, sender_name: 'Sendchamp', route: 'dnd' },

                    ]


                    const customerToBeUpdated = await User.findOne({ payStackCustomerID: customer_code });

                    if (customerToBeUpdated) {

                        customerToBeUpdated.isVerified = "true";

                        const saveCustomerStatus = await customerToBeUpdated.save()

                        io.emit("customer-verification", { message: messageContent[0] })

                    }
                    else {
                        throw Error("Customer does not exist")

                    }

                    await sendVerificationSms(messageContent[0])

                    break;
                }

            case "customeridentification.failed":
                {
                   
                    res.sendStatus(200)

                    const { customer_code } = data

                    

                    if (!customer) throw Error("customer not found")

                    const customerToBeUpdated = await User.findOne({ payStackCustomerID: customer_code });

                    console.log(customerToBeUpdated);

                    if (customerToBeUpdated) {

                        customerToBeUpdated.isVerified = "false";

                        const saveCustomerStatus = await customerToBeUpdated.save()

                        io.emit("customer-verification", { message: messageContent[1] })



                    } else {
                        throw Error("Customer does not exist")
                    }


                    await sendVerificationSms(messageContent[1])

                    break;
                }

            case "charge.success": {
                res.sendStatus(200);

                const { data } = req.body;

                const { customer, metadata, amount} = data

                const {book} = metadata

                const customerToBeUpdated = await User.findOne({ customer_code: customer?.customer_code });

                if (!customerToBeUpdated) throw Error("Customer not found!")



                await customerToBeUpdated.transactions.push({ ...data, item: { ...metadata } });

                const savedCustomer = await customerToBeUpdated.save()

                const messageContent = { to: '2347051807727', message: `Customer (${customer?.customer_code}) ${customerToBeUpdated?.first_name} ${customerToBeUpdated?.last_name} just bought a book ${book?.bookName} by ${book.bookAuthor} for NGN${parseFloat(amount/100)}`, sender_name: 'Sendchamp', route: 'dnd' }

                sendVerificationSms(messageContent)

                break

            }

            default:
                res.sendStatus(404)
                break;
        }



    } catch (error) {
        console.error(error);
        if(error.code === 404){
            console.log("haha 404");
            return
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }



})

export default router