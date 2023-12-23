import axios from 'axios'
import { SENCHAMP_SECRET_LIVE } from '../config.js';



export const sendVerificationSms = async(content)=>{
    const url = "https://api.sendchamp.com/api/v1/sms/send"

    const {to, message, sender_name, route} = content;

    if(!to || !message || !sender_name || !route) throw Error("Invalid message content")

    const send = await axios.post(url, content,{
        headers:{
            Accept: 'application/json,text/plain,*/*',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SENCHAMP_SECRET_LIVE}`
        }
    }).then((res)=>{
        console.log(res.data);
    }).catch((err)=>{
        console.log(err);
    })
}