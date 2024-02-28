//Webhooks are basically just routes that are primartly used for event listening


import express from 'express';
import crypto from 'crypto'
const router = express.Router()
import { io } from '../index.js';
import { sendVerificationSms } from '../utils/sendVerificationMessage.js';
import { User } from '../models/userModel.js';
import { PAYSTACK_SECRET_LIVE, PAYSTACK_SECRET_TEST } from '../config/config.js';
import { Book } from '../models/bookModel.js';
import { transporter } from '../utils/sendMail.js';
import { mailOptions } from '../utils/sendEmailVerification.js';

const allowContinuation = (req) => {
    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_TEST).update(JSON.stringify(req.body)).digest('hex');

    //TODO: remove the comment below
    if (hash !== req.headers['x-paystack-signature']) {
        throw new Error("Invalid signature! Request is unauthorized")
    }

}





router.post('/customer-verification', async (req, res) => {

    allowContinuation(req)

    console.log("WEB HOOOOOOOOOOOKKKKKKKKKKKK WAS HIT");

    console.log("============================================================");



    try {
        const { event, data } = req.body;

        mailOptions.to = data?.customer?.email



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


                    const customerToBeUpdated = await User.findOne({ payStackCustomerID: data?.customer_code });

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

                    const customer = await User.findOne({ payStackCustomerID: data?.customer_code })

                    if (!customer) throw Error("customer not found")



                    console.log(customer);

                    if (customer) {

                        customer.isVerified = "false";

                        const saveCustomerStatus = await customer.save()

                        io.emit("customer-verification", { message: messageContent[1] })



                    } else {
                        throw Error("Customer does not exist")
                    }


                    await sendVerificationSms(messageContent[1])

                    break;
                }

            case "charge.success": {
                

                const { data } = req.body;

                const { customer, metadata, amount } = data


                console.log("The book metadata from metadata paystack",metadata);

                console.log("The data from paystack", data);

                console.log("customer from paystack",customer);

                const { book } = metadata

                console.log("book from meta data", book);

                const customerToBeUpdated = await User.findOne({ payStackCustomerID: customer?.customer_code });

                console.log(customerToBeUpdated);

                if (!customerToBeUpdated) throw Error("Customer not found!")

                await customerToBeUpdated.transactions.push({ ...data, item: { ...metadata } });

                const savedCustomer = await customerToBeUpdated.save()

                console.log("the book ID", book?.bookId);

                const purchasedBook = await Book.findOne({ bookId: book?.bookId }); 
                
                if(purchasedBook === null){
                    res.sendStatus(400);
                    break;
                }


                console.log("The purchased book??",purchasedBook);

                purchasedBook.transactionId = data.id

                const savePurchasedBook  = await purchasedBook.save();

                res.sendStatus(200);

                

                const messageContent = { to: '2347051807727', message: `Customer (${customer?.customer_code}) ${customerToBeUpdated?.first_name} ${customerToBeUpdated?.last_name} just bought a book ${book?.title} by ${book.author} for NGN${parseFloat(amount / 100)}`, sender_name: 'Sendchamp', route: 'dnd' }

                io.emit('charge.success', { message: messageContent.message })

                await sendVerificationSms(messageContent)

                break

            }

            case "refund.processing": {


                res.sendStatus(200);

                mailOptions.subject = "Refund is processing..."
                mailOptions.html = `<div style="font-size:20px;">Dear valued customer, your refund is being processed.
                <br/>
                The transaction reference is ${data?.transaction_reference}
                </div>`


                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                });

                io.emit("refund", { message: "Refund is being processed" });

                break;
            }

            case "refund.pending": {
                res.sendStatus(200);

                mailOptions.subject = "Refund is pending..."
                mailOptions.html = `<div style="font-size:20px;">Dear valued customer, your refund is being pending.
                <br/>
                The transaction reference is ${data?.transaction_reference}
                </div>`


                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                });

                io.emit("refund", { message: "Refund is pending" });
                break;
            }

            case "refund.processed": {
                res.sendStatus(200);

                mailOptions.subject = "Success: Refund has been processed"
                mailOptions.html = `<div style="font-size:20px;">Dear valued customer, your refund has been processed and you have shall recieved your money within 10 Business days.
                <br/>
                The transaction reference is ${data?.transaction_reference}
                </div>`


                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                });

                io.emit("refund", { message: "Success! Your refund has been processed!" });

                const messageContent = { to: '2347051807727', message: `Customer with email ${email.replace('@', '&#64;')} has been refunded. The transaction reference is ${data?.transaction_reference}`, sender_name: 'Sendchamp', route: 'dnd' }

                await sendVerificationSms(messageContent)

                break;
            }

            default:
                res.sendStatus(404)
                break;
        }



    } catch (error) {
        console.error("WEBHOOK ERROR", error);
    }



})

export default router