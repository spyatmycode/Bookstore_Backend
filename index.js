import dotenv from 'dotenv';
dotenv.config();
import {} from 'dotenv/config';
import express from 'express';
import { PORT, MONGODBURL } from './config.js'
import mongoose from 'mongoose'
import booksRouter from './routes/booksRoutes.js';
import userRouter from './routes/userRoutes.js';
import payStackUserRouter from './routes/payStack.js'
import webHookRouter from './webhooks/customerVerification.js'
import cors from 'cors'
import { Server } from 'socket.io';
import http from 'http'

const app = express();


app.use(express.json());
app.use(cors());
app.use('/books', booksRouter)
app.use('/api/users',userRouter)
app.use('/api/paystack', payStackUserRouter);
app.use('/api/webhooks', webHookRouter)


const server = http.createServer(app)


export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
});


app.get('/', function (req, res) {

    return res.status(200).send("This is the home route");

})

io.on('connection', (socket) => {
    console.log('A user connected on'  + socket.id);
});


io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });


  io.emit("message")
//Connect to the database and then the server starts


mongoose.connect(MONGODBURL).then(() => {

    console.log("App is connected to the database");
    server.listen(PORT, () => {
      
        console.log(`App is listening on port ${PORT}`);
        
    })

}).catch((err) => {
    console.log(err);
})


/* app.use(
    cors(
        {
            origin: 'https://localhost: 5173',
            methods: ['GET', 'PUT', 'POST', 'DELETE'],
            allowedHeaders:'content-type'
        }
    )
) */