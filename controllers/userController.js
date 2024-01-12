import { User } from "../models/userModel.js";
import validator from "validator";
import { generateAccessToken } from "../utils/generateAccessToken.js";
import jwt from 'jsonwebtoken'
import { DOMAIN_URL, SECRET } from "../config/config.js";
import { sendVerificationEmail } from "../utils/sendEmailVerification.js";



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

        const newuser = await User.signup(email, password, first_name, last_name, phone, payStackCustomerCode);

        const sendEmailVerification = await sendVerificationEmail(email)




        //they are expecting a link that will send them the link to send the verification mail.
        //then clicking the link from the email will verify their email and then redirect them to the login page




        // email, password, first_name,last_name, customer_code

        //generate a new user token that keeps them authenticated until it expires

        const token = generateAccessToken(newuser._id)

        return res.status(201).send({ message: "Account created. Please verify your email", email: newuser.email, token })
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

        if(user.error){
            console.log("here");
            return res.status(200).send({message: user.error})
        }

        const token = generateAccessToken(user._id)

        return res.status(200).send({ email: user.email, token: token })

    } catch (error) {

        return res.status(400).send({ message: error.message });

    }
}

export const sendEmailVerification = async(req, res)=>{

    const {email} = req.query;


    if(!email) throw Error("Enter email please")

    try {
        const link = await sendVerificationEmail(email);

        return res.status(200).send({message: "Verification email sent!"})
    } catch (error) {

        return res.status(500).send({message: error.message || "An error occured"})
        
    }

}

export const verifyEmail = async (req, res) => {
    const { email, token } = req.query


    const payload = jwt.verify(token, SECRET)


    const user = await User.findOne({ email: email })

    user.emailConfirmed = "true"

    const saveUser = await user.save()

    res.status(200).send(`<div style="font-size:20px;"> Akeju loves you <br/> Email verified successfully. Click <a href="${DOMAIN_URL}/auth">here</a> to login</div>`);

     
}


export const getUserData = async (req, res) => {
    try {
        const {email} = req;

        if (!email) throw Error("Please enter an email address");

        const currentUserData = await User.findOne({ email }).select('first_name last_name payStackCustomerID phone isVerified bvn account_number bank country')

        if (!email) throw Error("User Data Not found");



        return res.status(200).send({ data: currentUserData })
    } catch (error) {

        if (error.message === "User Data Not found") {

            return res.status(404).send({ message: error.message })

        }

        return res.status(400).send({ message: error.message })


    }
}

