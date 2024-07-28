import mongoose from "mongoose";

const connectToDB = () => {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.log(error));
};

export { connectToDB };
