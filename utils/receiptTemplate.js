import QRCode from "qrcode"; 



export async function recieptTemplate(content){
    
    const {name, author, publishYear, price, downloadUrl} = content


    const qrCodeData = downloadUrl
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

    


    return (
        `
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
                        <td style="color:dodgerblue;text-transform:capitalize">${name.toString()}</td>
                    </tr>
                    <tr>
                        <th>Date</th>
                        <td style="color:red;text-transform:capitalize">${publishYear.toString()}</td>
                    </tr>
                    <tr>
                        <th>Author name</th>
                        <td style="text-transform:capitalize">${author.toString()}</td>
                    </tr>
                    <tr>
                        <th>Price</th>
                        <td>NGN${price.toString()}</td>
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
    )
}