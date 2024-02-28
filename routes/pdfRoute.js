import express from "express"
import { transporter } from "../utils/sendMail.js";
import pdf from "html-pdf";
import QRCode from "qrcode"; // Import the qrcode package




const router = express.Router()



router.post('/pdf/send', async (req, res) => {

    const qrCodeData = "https://www.meekfi.com/careers"
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);



    try {

        // Step 1: Generate PDF using html-pdf package


        const htmlContent = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            background-color: white;
            font-family: "Open sans", sans-serif;
            display: flex;
            flex-direction: column;
            height: 100vh;
            width: 100%;
            align-items: center;
            justify-content: center;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            max-width: 600px; /* Adjust as needed */
        }

        th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        th {
            background-color: #f2f2f2;
        }

        .divider {
            display: block;
            width: 100%;
        }

        .divider_top {
            height: 20vh;
        }

        .divider_bottom {
            height: 80vh;
            background-color: #FBFBFB;
        }

        .parent {
            position: absolute;
            box-shadow: 0 5px 10px 0 gray;
            display: flex;
            justify-content: center;
            width: auto;
            align-items: center;
            gap: 100px;
            padding: 20px 30px;
            background-color: white;
            border-radius: 20px;
        }

        .not_qr {
            display: flex;
            flex-direction: column;
            width: 100%;
            gap: 10px;
            padding: 20px 30px;
            background-color: white;
            border-radius: 20px;
        }

        .first_row {
            display: flex;
            flex-direction: column;
            align-items: start;
            gap: 20px;
        }

        .book_div, .author_div {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        img {
            width: 300px;
            height: 300px;
        }
    </style>
</head>
<body style="width:100%; display:flex; align-items:center; justify-content:center;">
    <div class="divider divider_top"></div>
    <div class="parent">
        <table>
            <tbody>
                <tr>
                    <th>Book name</th>
                    <td style="color:dodgerblue;">The actual event name</td>
                </tr>
                <tr>
                    <th>Date</th>
                    <td style="color:red;">2024</td>
                </tr>
                <tr>
                    <th>Author name</th>
                    <td>Akeju Oluwanifemi</td>
                </tr>
                <tr>
                    <th>Price</th>
                    <td>NGN 100</td>
                </tr>
            </tbody>
        </table>
        <div class="qr_code">
            <img src="${qrCodeImage}" alt="QR CODE">
        </div>
    </div>
    <div class="divider divider_bottom"></div>
</body>
</html>
`

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

        // Step 2: Set up Node Mailer

        // Step 3: Generate PDF and Send Email
        pdf.create(htmlContent, options).toStream((err, stream) => {
            if (err) return console.log(err);

            const mailOptions = {
                from: 'akejunifemi11@gmail.com',
                to: 'akejunifemi11@gmail.com',
                subject: 'Sample PDF attached',
                text: 'Please find attached the sample PDF.',
                attachments: [
                    {
                        filename: 'sample.pdf',
                        content: stream
                    }
                ]
            };

            // Send email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });


        return res.status(200).send({
            message: "Email Ticket sent successfully"
        })
    } catch (error) {

        console.log(error);

    }

})

export default router



/*         const htmlContent = `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>PDF Result Template</title>
          <style>
             .invoice-box {
             max-width: 800px;
             margin: auto;
             padding: 30px;
             border: 1px solid #eee;
             box-shadow: 0 0 10px rgba(0, 0, 0, .15);
             font-size: 16px;
             line-height: 24px;
             font-family: 'Helvetica Neue', 'Helvetica',
             color: #555;
             }
             .margin-top {
             margin-top: 50px;
             }
             .justify-center {
             text-align: center;
             }
             .invoice-box table {
             width: 100%;
             line-height: inherit;
             text-align: left;
             }
             .invoice-box table td {
             padding: 5px;
             vertical-align: top;
             }
             .invoice-box table tr td:nth-child(2) {
             text-align: right;
             }
             .invoice-box table tr.top table td {
             padding-bottom: 20px;
             }
             .invoice-box table tr.top table td.title {
             font-size: 45px;
             line-height: 45px;
             color: #333;
             }
             .invoice-box table tr.information table td {
             padding-bottom: 40px;
             }
             .invoice-box table tr.heading td {
             background: #eee;
             border-bottom: 1px solid #ddd;
             font-weight: bold;
             }
             .invoice-box table tr.details td {
             padding-bottom: 20px;
             }
             .invoice-box table tr.item td {
             border-bottom: 1px solid #eee;
             }
             .invoice-box table tr.item.last td {
             border-bottom: none;
             }
             .invoice-box table tr.total td:nth-child(2) {
             border-top: 2px solid #eee;
             font-weight: bold;
             }
             @media only screen and (max-width: 600px) {
             .invoice-box table tr.top table td {
             width: 100%;
             display: block;
             text-align: center;
             }
             .invoice-box table tr.information table td {
             width: 100%;
             display: block;
             text-align: center;
             }
             }
          </style>
       </head>
       <body>
          <div class="invoice-box">
             <table cellpadding="0" cellspacing="0">
                <tr class="top">
                   <td colspan="2">
                      <table>
                         <tr>
                            <td class="title"><img  src="https://i2.wp.com/cleverlogos.co/wp-content/uploads/2018/05/reciepthound_1.jpg?fit=800%2C600&ssl=1"
                               style="width:100%; max-width:156px;"></td>
                            <td>
                               Datum: ${`${today.getDate()}. ${today.getMonth() + 1}. ${today.getFullYear()}.`}
                            </td>
                         </tr>
                      </table>
                   </td>
                </tr>
                <tr class="information">
                   <td colspan="2">
                      <table>
                         <tr>
                            <td>
                               Customer name: Akeju Oluwanifemi
                            </td>
                            <td>
                               Receipt number: 12334
                            </td>
                         </tr>
                      </table>
                   </td>
                </tr>
                <tr class="heading">
                   <td>Bought items:</td>
                   <td>Price</td>
                </tr>
                <tr class="item">
                   <td>First item:</td>
                   <td>$200$</td>
                </tr>
                <tr class="item">
                   <td>Second item:</td>
                   <td>100$</td>
                </tr>
             </table>
             <br />
             <h1 class="justify-center">Total price: ${parseInt(100) + parseInt(200)}$</h1>
          </div>
       </body>
    </html>` */;