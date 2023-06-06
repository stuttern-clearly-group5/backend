import mongoose from 'mongoose';


const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        accountStatus: {
            type: String, 
            enum: ['Pending', 'Active'],
            default: 'Pending'
        },
        confirmationCode: { 
            type: String, 
            unique: true 
        }

    }, 
    { timestamps: true}
);

const User = mongoose.model('User', userSchema);
export default User;