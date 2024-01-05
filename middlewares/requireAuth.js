import jwt from 'jsonwebtoken';
import { SECRET } from '../config/config.js';
import { User } from '../models/userModel.js';


export const requireAuth = async (req, res , next)=>{

try {

    
    const {authorization } = req.headers;

    const Authorization = authorization;

    

    if(!Authorization){
        return res.status(401).send({message: "Please enter authorization token"});
    }

    const token = Authorization.split(' ')[1];

    const {_id} =  jwt.verify(token, SECRET);

    const userId = await User.findOne({_id}).select('_id');
    const customer_code = await User.findOne({_id}).select('payStackCustomerID first_name last_name');
    if(!customer_code) throw Error("customer code not found")
    req.userId = userId;
    req.customer_code = customer_code?.payStackCustomerID
    req.first_name = customer_code.first_name;
    req.last_name = customer_code.first_name;

    

    next();

} catch (error) {

    console.log(error);

    return res.status(401).send({message:"Request is not authorized"});
    
}



}