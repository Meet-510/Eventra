const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/auth.js');
const eventRoutes = require('./routes/events.js');
const bookingRoutes = require('./routes/booking.js');

dotenv.config();
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/auth',authRoutes);
app.use('/api/events',eventRoutes);
app.use('/api/bookings',bookingRoutes);

// connect to MongoDB

mongoose.connect(process.env.MONGODB_URI)
.then(() =>{
    console.log('connected to MongoDB');

})
.catch((error) => {
    console.error('Error connecting to MongoDB', error);

});

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
    const path = require('path');
    app.get('*',(req,res) => {   
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));    
    });
}

app.listen(PORT, ()=>{
    console.log(`server is running on PORT ${PORT}`);
});