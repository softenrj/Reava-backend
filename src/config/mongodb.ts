import mongoose from "mongoose";

mongoose.Promise = Promise

const connectDb = async (): Promise<void> => {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log("DATABASE is Already Connected")
            return;
        }
        await mongoose.connect(process.env.MONGO_URI || '')
        console.log('MongoDB is connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    }
}

export default connectDb