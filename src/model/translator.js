import mongoose from 'mongoose';


const translatorSchema = new mongoose.Schema(
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
        },
        resetToken: {
            type: String,
        
          },
          
        tokenExpiryTime: {
            type: Date,
          },

    }, 
    { timestamps: true}
);

const Translator = mongoose.model('Translator', translatorSchema);
export default Translator;