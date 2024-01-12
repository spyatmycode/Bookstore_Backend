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



        const token = generateAccessToken(newuser._id)

        return res.status(201).send({ message: "Account created. Please verify your email", email: newuser.email, token })
    } catch (error) {

        console.log(error);

        return res.status(500).send({ message: error.message })

    }
}

//This is to log a user in

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) throw Error("Please enter all required information");

        if (!validator.isEmail(email)) throw Error("Enter a valid email");

        const user = await User.login(email, password);

        if (user.error) {
            console.log("here");
            return res.status(200).send({ message: user.error })
        }

        const token = generateAccessToken(user._id)

        return res.status(200).send({ email: user.email, token: token })

    } catch (error) {

        return res.status(400).send({ message: error.message });

    }
}

//To send email verification

export const sendEmailVerification = async (req, res) => {

    const { email } = req;


    if (!email) throw Error("Enter email please")

    try {
        const link = await sendVerificationEmail(email);

        return res.status(200).send({ message: "Verification email sent!" })
    } catch (error) {

        return res.status(500).send({ message: error.message || "An error occured" })

    }

}

//To verify a user email

export const verifyEmail = async (req, res) => {
    const { email, token } = req.query

    try {

        const payload = jwt.verify(token, SECRET)

        if (payload.email !== email) {
            return res.status(400).send(`<div style="font-size:20px;"> Unauthorized <a href="${DOMAIN_URL}/auth"> Sign up here</a> to login</div>`);

        }

        const user = await User.findOne({ email: email })

        if (!user) {

            return res.status(200).send(`<div style="font-size:20px;">User not found <a href="${DOMAIN_URL}/auth">here</a> to login</div>`);

        }

        user.emailConfirmed = "true"

        const saveUser = await user.save()

        res.status(200).send(`<div style="font-size:20px;"> Akeju loves you <br/> Email verified successfully. Click <a href="${DOMAIN_URL}/auth">here</a> to login</div>`);


    } catch (error) {

        if (error.name === 'TokenExpiredError') {
            return res.status(401).send(`<div style="font-size:20px;"> Token has expired. <a href="${DOMAIN_URL}/auth">here</a> to login</div>`);
        }

        console.error(error);
        return res.status(401).send(`<div style="font-size:20px;"> Unauthorized <a href="${DOMAIN_URL}/auth">here</a> to login</div>`);

    }




}


//To get user data from db

export const getUserData = async (req, res) => {
    try {
        const { email } = req;

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

