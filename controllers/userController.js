import { User } from "../models/userModel.js";
import validator from "validator";
import { generateAccessToken } from "../utils/generateAccessToken.js";



//This is to create a new user

export const createUser = async (req, res) => {


    try {

        //retrieve user data from the request body
        const { first_name, last_name, phone, password, email } = req.body;

        //retrieve the customer code from the paystack middleare

        const { payStackCustomerCode, payStackUserData } = req

        if (!password || !email || !first_name || !last_name || !phone) return res.status(400).send({ message: "Please enter all required fields" });


        //throw errors if the email or password is invalid

        if (!validator.isEmail(email)) throw Error("Enter a valid email");
        if (!validator.isStrongPassword(password)) throw Error("Enter a strong password");


        //create a new user by passign details to the signup function created in the user model

        const newuser = await User.signup(email, password, first_name, last_name,phone, payStackCustomerCode);
        // email, password, first_name,last_name, customer_code

        //generate a new user token that keeps them authenticated until it expires

        const token = generateAccessToken(newuser._id)

        return res.status(201).send({ message: "User created successfully", email: newuser.email, token, payStackUserData })
    } catch (error) {

        console.log(error);

        return res.status(500).send({ message: error.message })

    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) throw Error("Please enter all required information");

        if (!validator.isEmail(email)) throw Error("Enter a valid email");

        const user = await User.login(email, password);

        const token = generateAccessToken(user._id)

        return res.status(200).send({ email: user.email, token: token })

    } catch (error) {

        return res.status(400).send({ message: error.message });

    }
}


export const getUserData = async(req, res)=>{
    try {
        const email = req.query.email;

        if(!email) throw Error("Please enter an email address");

        const currentUserData = await User.findOne({email}).select('first_name last_name payStackCustomerID phone isVerified bvn account_number bank country')

        if(!email) throw Error("User Data Not found");



        return res.status(200).send({data: currentUserData})
    } catch (error) {

        if(error.message ==="User Data Not found"){

            return res.status(404).send({message: error.message})

        }

        return res.status(400).send({message: error.message})

        
    }
}

