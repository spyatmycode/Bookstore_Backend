import jwt from 'jsonwebtoken'
import nodemailer from "nodemailer"
import { BREVO_MASTER_PASSWORD, BREVO_PORT, SECRET, BREVO_HOST, BREVO_LOGIN, API_URL } from "../config/config.js";

const transporter = nodemailer.createTransport({
    host: BREVO_HOST,
    port:BREVO_PORT,
    secure: false,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: BREVO_LOGIN,
      pass: BREVO_MASTER_PASSWORD,
    },
  });


  export const mailOptions = {
    from: 'akejunifemi11@gmail.com', // sender address
    to: "", // list of receivers
    cc: '', // Comma separated list or an array
    subject: '', // Subject line
    html: "" // html body
};




export const sendVerificationEmail =async (email)=>{
    const token = jwt.sign({email}, SECRET, {expiresIn: "1hr"})

    const link = `${API_URL}/api/users/email-verification?email=${email}&token=${token}`

    mailOptions.to = email;
    mailOptions.subject = "AKEJU BOOK STORE: Verify your email address";
    mailOptions.html = `<div style="font-size:20px;">Hi user with email: ${email} <br/> Please verify your email here <a href="${link}">here</a></div>`


    try {

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error sending email:', error);
            } else {
              console.log('Email sent:', info.response);
            }
          });


        
    } catch (error) {

        console.log(error);

    }

    return link


}

