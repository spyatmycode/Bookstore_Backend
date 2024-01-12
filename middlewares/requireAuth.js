import jwt from 'jsonwebtoken';
import { SECRET } from '../config/config.js';
import { User } from '../models/userModel.js';


export const requireAuth = async (req, res, next) => {
    try {
        console.log(req.headers);

        console.log(req);

        const { authorization } = req.headers;

        console.log("The auth header:", authorization);

        const Authorization = authorization;

        console.log("The auth variable:", Authorization);

        if (!Authorization) {
            console.log("No user token");
            return res.status(401).send({ message: "Please enter authorization token" });
        }

        const token = Authorization.split(' ')[1];

        const { _id } = jwt.verify(token, SECRET);

        const userId = await User.findOne({ _id }).select('_id email');
        const customer_code = await User.findOne({ _id });
        
        if (!customer_code) throw Error("customer code not found");
        
        req.userId = userId;
        req.customer_code = customer_code?.payStackCustomerID;
        req.first_name = customer_code.first_name;
        req.last_name = customer_code.last_name;
        req.email = customer_code.email;

        console.log(customer_code);

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).send({ message: "Request is not authorized" });
    }
};