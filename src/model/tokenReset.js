/*import mongoose from ("mongoose");

const tokenSchema = new mongoose.Schema({
  username: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,// this is the expiry time in seconds
  },
});

const Token = mongoose.model("Token", tokenSchema);
export default Token;
*/