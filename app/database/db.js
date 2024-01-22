require('dotenv').config()
const mongoose = require('mongoose');
exports.connectMonggose = () => {
    mongoose.connect(process.env.DATABASE_URL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        })
        .then(() => {
            console.log("Connected to MongoDB: Book Store");
        })
        .catch((error) => {
            if (error instanceof mongoose.Error && error.name === 'MongoServerSelectionError') {
                console.error(`Failed to connect to MongoDB: Server selection timed out. Please check your MongoDB server.`);
            } else {
                console.error("Failed to connect to MongoDB:", error.message);
            }
        });

    // Event listeners for handling various connection events
    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
        console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose disconnected from MongoDB');
    });

    // Close the Mongoose connection if Node process ends
    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log('Mongoose connection closed due to application termination');
            process.exit(0);
        });
    });
}