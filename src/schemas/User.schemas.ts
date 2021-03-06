import mongoose, { Schema } from "mongoose";
import { IRegisterUser } from "../Interfaces";

const UserSchema = new Schema<IRegisterUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    fullName: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
    },
    sex: {
      type: String,
      enum: ["Erkek", "Kadın", "Belirtilmemiş"],
      default: "Belirtilmemiş",
    },
    lastLogin: {
      type: Date,
      default: new Date(),
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user",
    },
    carts: {
      type: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
          },
          quantity: {
            type: Number,
          },
          size: {
            type: String,
          },
          color: Schema.Types.ObjectId,
        },
      ],
    },
    phone: {
      type: String,
    },
    orderHistory: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("User", UserSchema);
