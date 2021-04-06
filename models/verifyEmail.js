import mongoose from "mongoose";
const Schema = mongoose.Schema;

const verifyEmailSchema = Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("VerifyEmails", verifyEmailSchema);
