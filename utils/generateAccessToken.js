import jwt from 'jsonwebtoken';
import { SECRET } from '../config.js';

export const generateAccessToken = (_id)=>{

    return jwt.sign({_id},SECRET,{expiresIn:'1d'});

}