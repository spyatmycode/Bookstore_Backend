import axios from 'axios';
import { PAYSTACK_SECRET_LIVE, PAYSTACK_SECRET_TEST } from '../config.js';
import { User } from '../models/userModel.js';
import bycrpt from 'bcrypt'
import { hashBVN } from '../utils/hashBVN.js';

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
    try {
        const { country, type, account_number, bvn, bank_code, first_name, last_name } = req.body;

        const customer_code = req.customer_code



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

        const userToBeUpdated = await User.findOne({payStackCustomerID:customer_code});

        userToBeUpdated.first_name = first_name;
        userToBeUpdated.last_name = last_name;
        userToBeUpdated.bvn = await hashBVN(bvn)
        userToBeUpdated.isVerified = "pending";
        userToBeUpdated.bank = bank_code;
        userToBeUpdated.country = country;
        userToBeUpdated.account_number = account_number;

        const saveUserVerificationStatus = await userToBeUpdated.save()

        return res.status(200).send({ message: "Customer verification is being processed" })



    } catch (error) {

        console.log(error);

        return res.status(400).send({ messagae: "An error occured" })

    }
}


//This is to retrieve a single paystack customer


export const getPayStackCustomer = async (req, res) => {
    try {

        const email = req.query.email;

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