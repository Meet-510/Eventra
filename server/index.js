const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/auth');

dotenv.config();
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/auth'. authRoutes);

// connect to MongoDB

mongoose.connect(process.env.MONGODB_URI)
.then(() =>{
    console.log('connected to MongoDB');

})
.catch((error) => {
    console.error('Error connecting to MongoDB', error);

});


app.listen(PORT, ()=>{
    console.log(`server is running on PORT ${PORT}`);
});