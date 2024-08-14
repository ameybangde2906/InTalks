import mongoose from "mongoose";

const connectMongoDB = async () => {
try {
    const dbConnection = await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log(`Mongodb connected !`)
} catch (error) {
    console.log(`Error connection to mongodb: ${error.message}`)
    process.exit(1)
}
}

export default connectMongoDB;