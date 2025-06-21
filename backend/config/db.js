import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB qoşuldu');
  } catch (error) {
    console.error('Mongo bağlantı xətası:', error.message);
    process.exit(1);
  }
};

export default connectDB;
