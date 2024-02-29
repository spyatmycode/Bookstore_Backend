import { transporter } from "./sendMail.js";

import { recieptTemplate } from "./receiptTemplate.js";
import pdf from "html-pdf";






export const sendReceipt = async(email, content)=>{

    console.log("We're in the sendReciept");
    console.log("Contenet at sendReciept", content);
    



  

    const options = {
        format: 'A4',
        border: {
            top: '0',
            right: '0',
            bottom: '0',
            left: '0'
        },
        height: '12.5in', // A4 height
        width: '8in' // A4 width
    }

    pdf.create(await recieptTemplate(content), {
        format: 'A4',
        border: {
            top: '0',
            right: '0',
            bottom: '0',
            left: '0'
        },
        height: '12.5in', // A4 height
        width: '8in', // A4 width
        childProcessOptions: {
            env: {
                OPENSSL_CONF: '/dev/null',
            },
        },
    }).toStream((err, stream) => {
        if (err) {
            console.log("Error creating PDF:", err);
            return;
        }
    
        const mailOptions = {
            from: 'akejunifemi11@gmail.com',
            to: email,
            subject: 'You bought this tickets from us!',
            text: 'Please find attached the book ticket PDF.',
            attachments: [
                {
                    filename: `${content.name}_${content.name}_${content.publishYear}.pdf`,
                    content: stream,
                },
            ],
        };
    
        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("An error occurred while sending your email:", error);
            } else {
                console.log('Book ticket sent successfully:', info);
            }
        });
    });
    



}