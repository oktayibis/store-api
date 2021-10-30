import mongoose, {Schema } from "mongoose";
import { IRegisterUser } from "../Interfaces";


const UserSchema = new Schema<IRegisterUser>({
  email: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true,
    minlength:6
  },
  fullName: {
    type: String,
    required:true
  },
  birthDate: {
    type:Date
  },
  sex: {
    type: String,
    enum: ["Erkek", "Kadın", "Belirtilmemiş"],
    default:"Belirtilmemiş"
  },
  lastLogin: {
    type: Date,
    default:new Date()
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    required: true,
    default:"user"
  },
  carts: {
    type: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref:"Product"
      },
      amount: {
        type: Number,
        required:true
      },
      addInfo: {
        type:Object
      }
    }]
  },
  phone: {
    type: String
  }

}, { timestamps: true, versionKey: false })

export default mongoose.model("User", UserSchema)