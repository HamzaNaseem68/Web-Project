const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('MongoDB URI:', process.env.MONGO_URI ? 'Using MONGO_URI from .env' : 'Using local MongoDB');

        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/securepro_db', {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
        console.log(`📊 Database Name: ${conn.connection.name}`);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:');
        console.error(`Error Message: ${error.message}`);
        console.error(`Error Name: ${error.name}`);

        if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
            console.error('\n💡 Possible Solutions:');
            console.error('1. Check your internet connection');
            console.error('2. Verify MongoDB Atlas cluster is running');
            console.error('3. Check if your IP address is whitelisted in MongoDB Atlas');
            console.error('4. Verify the connection string in .env file');
        }

        console.error('\n⚠️  Server will continue running but database operations will fail.');
        // Don't exit the process, let the server run
        // process.exit(1);
    }
};

module.exports = connectDB;
