import axios from 'axios';
import { PAYSTACK_SECRET_LIVE, PAYSTACK_SECRET_TEST } from '../config/config.js';
import { User } from '../models/userModel.js';
import bycrpt from 'bcrypt'
import { hashBVN } from '../utils/hashBVN.js';
import { io } from '../index.js';

//This is to create a paystack customer

export const createPayStackCustomer = async (req, res) => {

    const { email, first_name, last_name, phone } = req.body;

    if(!email || !first_name || !last_name || !phone) throw Error("Please enter all customer details to create customer")

    const url = `https://api.paystack.co/customer`

    const customer = {
        email,
        first_name,
        last_name,
        phone

    }

    try {

        const response = await axios.post(url, customer, {

            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_LIVE}`,
                'Content-Type': 'application/json'
            }
        })

        return res.status(200).json({ data: response.data })


    } catch (error) {


        console.log(error);

        return res.status(400).send({ message: error.message })

    }
}


//This is to validate a paystack customer


export const validatePayStackCustomer = async (req, res) => {

    const { country, type, account_number, bvn, bank_code, first_name, last_name } = req.body;

    console.log(country);

  

    const customer_code = req.customer_code //This gotten from the requireAuth middleware.

    const userToBeUpdated = await User.findOne({payStackCustomerID:customer_code});



    try {
       

        if (!country || !type || !account_number || !bvn || !bank_code || !first_name || !last_name) {
            throw Error("Please enter all fields for customer validation");
        }

        const verification = await axios.post(`https://api.paystack.co/customer/${customer_code}/identification`, {
            country, type, account_number, bvn, bank_code, last_name, first_name
        }, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_LIVE}`,
                'Content-Type': 'application/json'
            }
        })

        

        userToBeUpdated.first_name = first_name;
        userToBeUpdated.last_name = last_name;
        userToBeUpdated.bvn = await hashBVN(bvn)
        userToBeUpdated.isVerified = "pending";
        userToBeUpdated.bank = bank_code;
        userToBeUpdated.country = country;
        userToBeUpdated.account_number = account_number;

        io.emit("customeridentification.success", {
            message: "Customer verification success"
        })

        const saveUserVerificationStatus = await userToBeUpdated.save()

        return res.status(200).send({ message: "Customer verification is being processed" })



    } catch (error) {

        // console.log("CONTROLLER ERROR",error);
        if(error?.response?.data?.message === "Customer already validated using the same credentials"){
            console.log("IN here chief");


            userToBeUpdated.isVerified = "true";

            io.emit("customeridentification.success", {
                message: "Customer verification success"
            })

            await userToBeUpdated.save()

            return res.status(200).send({ message: "This user has been verified successfully" })

        }
        console.log(error.response.data.message);

        return res.status(400).send({ message: "An error occured" })

    }
}


//This is to retrieve a single paystack customer


export const getPayStackCustomer = async (req, res) => {
    try {

        const {email} = req;

        console.log(email);

        if (!email) {
            throw new Error("Please enter email address for this user")

        }
        const response = await axios.get('https://api.paystack.co/customer', {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_LIVE}`,
                'Content-Type': 'application/json'
            }
        })

        const currentCustomer = response?.data?.data?.find((_) => _.email === email)

        res.status(200).send({ data: currentCustomer })



    } catch (error) {

        console.log(error);
        res.status(400).send({ message: error.message })

    }
}


export const refundCustomer = async(req, res)=>{

    const {transactionId} = req.body;

    console.log(transactionId);

    console.log(transactionId);

    try {
        const initiateRefund = await axios.post(`https://api.paystack.co/refund`,{
        transaction: transactionId
    },{
        headers:{
            Authorization:`Bearer ${PAYSTACK_SECRET_LIVE}`,
            "Content-Type":"application/json"
        }
    })

    io.emit("refund", {message: initiateRefund?.data?.message})


    return res.status(201).send({message: initiateRefund?.data?.message})

    } catch (error) {

        if(error.response.data.message ==="Transaction has been fully reversed"){
            return res.status(200).send({message: error.response.data.message})
        }

        io.emit("refund", {message: error.response.data.message} )

        console.log(error.response.data.message);
        
    }

    
    

    
    

    
}