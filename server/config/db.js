require('dotenv').config();
const mongoose = require('mongoose');

const connectionString = process.env.MONGO_URI;

const connectMongoDB = async () => {
    try{
        await mongoose.connect(connectionString);
        console.log('Successfully connected to MongoDB')
    }catch (error){
        console.log('Error connecting to DB: ', error.message)
    }
}

module.exports = connectMongoDB;