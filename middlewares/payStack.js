import axios from "axios"
import { PAYSTACK_SECRET_LIVE, PAYSTACK_SECRET_TEST } from "../config/config.js";


export const createPayStackCustomer = async (req, res, next) => {

    const { email, first_name, last_name, phone } = req.body;

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

        const payStackCustomerCode = await response.data.data.customer_code;
        const payStackUserData = await response.data.data

        req.payStackCustomerCode = payStackCustomerCode;
        req.payStackUserData = payStackUserData

        next();


    } catch (error) {


        console.log(error);

        next(error);

        return res.status(400).send({ message: "Error in creating customer" })

    }
}


export const getPayStackCustomer = async (req, res, next)=>{

        try {

            const {payStackCustomerID } = req.body
    
            const response = await axios.get('https://api.paystack.co/customer',{
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_TEST}`,
                    'Content-Type': 'application/json'
                  }
            })

            const customers = await response.data

            const currentCustomer = customers.find((_)=> _.customer_code === payStackCustomerID)

            req.customerData = currentCustomer;

            next();

            
        } catch (error) {
    
            console.log(error);
            res.status(400).send({message:"An error has occurred"})
            
        }
    }