import * as dotenv from "dotenv";
dotenv.config();
import mongoose from 'mongoose';
const username = encodeURIComponent(process.env.DB_USERNAME);
const password = encodeURIComponent(process.env.DB_PASSWORD);

const connectString =`mongodb+srv://${username}:${password}@clearly.dhcw9rh.mongodb.net/?retryWrites=true&w=majority`
const connection=mongoose.connect(connectString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected Successfully')
}).catch((e)=> {
    console.log(e);
    console.log('Connection Failed')
})

export default connection