import mongoose, { Schema } from "mongoose";

const ResetPassword = new Schema({
  email: {
    type: String,
    required: true,
  },
  resetCode: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ResetPassword", ResetPassword);
