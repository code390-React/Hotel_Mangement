const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const UserRoutes = require('./routes/routes');
const productroute = require('./routes/privateroute');
const bookingRoutes = require('./routes/bookingRoutes');
const roomRoutes = require('./routes/roomRoutes');

require('dotenv').config();

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api',UserRoutes);
app.use('/product',productroute)
app.use('/api/bookings', bookingRoutes);
app.use('/api/rooms', roomRoutes);

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

mongoose
        .connect(MONGO_URL)
        .then(()=>{
            console.log("Database is Connected succesfully");
            
            app.listen(PORT,()=>{
                console.log("Server is Running Fine");
            })
        })
        .catch((err)=>console.log(err));

