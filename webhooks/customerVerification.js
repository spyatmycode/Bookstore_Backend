//Webhooks are basically just routes that are primartly used for event listening


import express from 'express';
import crypto from 'crypto'
const router = express.Router()
import { io } from '../index.js';
import { sendVerificationSms } from '../utils/sendVerificationMessage.js';
import { User } from '../models/userModel.js';
import { PAYSTACK_SECRET_LIVE } from '../config.js';



router.post('/customer-verification', async (req, res) => {



    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_LIVE).update(JSON.stringify(req.body)).digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
        throw new Error("Invalid signature! Request is unauthorized")
    }

    try {
        const { event, data} = req.body;


        const customer = await User.findOne({payStackCustomerID: data?.customer_code}).select('first_name last_name')

        if(!customer) throw Error("customer not found")


        const messageContent = [
            { to: '2347051807727', message: `Customer (${customer?.first_name} ${customer?.last_name}) with code ${data?.customer_code} has been verified`, sender_name: 'Sendchamp', route: 'dnd' },
            { to: '2347051807727', message: `Customer(${customer?.first_name} ${customer?.last_name}) with code ${data?.customer_code} has failed verification because ${data?.reason}`, sender_name: 'Sendchamp', route: 'dnd' },
            
        ]

        const { customer_code } = data


        if (event === "customeridentification.success") {

            res.sendStatus(200)

            const customerToBeUpdated = await User.findOne({ payStackCustomerID: customer_code});

            if(customerToBeUpdated){

                customerToBeUpdated.isVerified = "true";

                const saveCustomerStatus = await customerToBeUpdated.save()

                io.emit("customer-verification", {message: messageContent[0]})

            }
            else{
                throw Error("Customer does not exist")
                
            }

            await sendVerificationSms(messageContent[0])

        }

        else if(event === "paymentrequest.success"){
            res.sendStatus(200);

            const messageContent = { to: '2347051807727', message: `Customer(${customer?.first_name} ${customer?.last_name}) with code ${data?.customer_code} has paid for ${data?.description} for #${(data?.amount)/100}`, sender_name: 'Sendchamp', route: 'dnd' }

            sendVerificationSms(messageContent)


        }
        
        
        else {
            res.sendStatus(200)

            const  customerToBeUpdated = await User.findOne({ payStackCustomerID: customer_code});

            console.log(customerToBeUpdated);

            if (customerToBeUpdated) {

                customerToBeUpdated.isVerified = "false";

                const saveCustomerStatus = await customerToBeUpdated.save()

                io.emit("customer-verification", {message: messageContent[1]})



            }else{
                throw Error("Customer does not exist")
            }


            await sendVerificationSms(messageContent[1])

        }


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }



})

export default router