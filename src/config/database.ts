import mongoose from "mongoose";

export const connectDatabase = async () => {
  const data = await mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`Mongodb connected with server : ${data.connection.host}`);
};
