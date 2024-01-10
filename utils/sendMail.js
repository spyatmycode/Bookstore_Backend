
import nodemailer from "nodemailer"
import { BREVO_MASTER_PASSWORD, BREVO_PORT, SECRET, BREVO_HOST, BREVO_LOGIN, API_URL } from "../config/config.js"


export const transporter = nodemailer.createTransport({
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
