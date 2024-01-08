import mongoose from "mongoose";
import bcrypt from "bcrypt";


const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true,

    },
    last_name: {
        type: String,
        required: true,

    },

    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    payStackCustomerID: {
        type: String,
        required: true

    },
    phone: {
        type: String,
        required: true,
        
    },
    bvn: {
        type: String,
        unique: true,
        default: "",

    },
    isVerified: {
        type: String,
        enum: ['true', 'false', 'pending'],
        default: 'false'

    },
    account_number: {
        type: String,
        minlength: [10, 'Account number must be at least 10 characters long'],
        maxlength: [10, 'Account cannot exceed 10 characters'],
        
    },
    bank:{
        type: String,
        default:""
    },
    country:{
        type: String,
        default:""
    },

    transactions:{
        type: [mongoose.Schema.Types.Mixed],
        default:[]
    },

    emailConfirmed:{

        type: String,
        enum: ["true", "false"],
        default: "false"

    }


}, {
    timestamps: true
});


userSchema.statics.signup = async function (email, password, first_name, last_name, phone, customer_code) {

    const emailExists = await this.findOne({ email })
    const customerExists = await this.findOne({ customer_code })

    if (emailExists) throw Error('Email already in use');
    if (customerExists) throw Error('This customer already exsits');

    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(password, salt);

    const newuser = await this.create({ email: email, password: hash, first_name, last_name, payStackCustomerID: customer_code, phone });


    



    return newuser



}

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) throw Error("Email does not exist");

    const match = await bcrypt.compare(password, user.password);

    if (!match) throw Error("Incorrect login credentials");



    if(user.emailConfirmed !== "true"){

        return {error: "Please verify your email"}

    }

    



    

    return user;


}

export const User = mongoose.model('User', userSchema)