import express from "express";
import { transporter } from "../utils/sendMail.js";
import PDFDocument from "pdfkit";
import SVGtoPDF from "svg-to-pdfkit";
import QRCode from "qrcode";

const router = express.Router();

router.post('/pdf/send', async (req, res) => {
    const qrCodeData = "https://www.meekfi.com/careers";
    const qrCodeImage = await QRCode.toString(qrCodeData, { type: 'svg', scale: 1, color: { dark: '#000000', light: '#ffffff' } });

    try {
        // Step 1: Generate PDF using pdfkit package
        const doc = new PDFDocument();
        let buffers = [];
        doc.on('data',  buffers.push.bind(buffers));
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);

            doc.text('Book name: The actual event name', 100, 100);
            doc.text('Date: 2024', 100, 120);
            doc.text('Author name: Akeju Oluwanifemi', 100, 140);
            doc.text('Price: NGN 100', 100, 160);
            SVGtoPDF(doc, qrCodeImage, 100, 180, { width: 100, height: 100 });

            // Step 2: Set up Node Mailer



            // Step 3: Send Email with PDF attachment
            const mailOptions = {
                from: 'akejunifemi11@gmail.com',
                to: 'akejunifemi11@gmail.com',
                subject: 'Sample PDF attached',
                text: 'Please find attached the sample PDF.',
                attachments: [
                    {
                        filename: 'sample.pdf',
                        content: pdfData
                    }
                ]
            };

             // Adjust width and height as needed

            // Send email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).send({ message: "Error sending email" });
                } else {
                    console.log('Email sent: ' + info.response);
                    return res.status(200).send({ message: "Email with PDF sent successfully" });
                }
            });
        });

        // Add text to PDF
       

        // Add QR code to PDF
       

        doc.end();
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Internal server error" });
    }
});

export default router;
