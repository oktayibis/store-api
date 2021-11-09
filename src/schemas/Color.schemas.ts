import mongoose, { Schema } from "mongoose";
import { IProductColor } from "../Interfaces";

const ColorSchema = new Schema<IProductColor>(
  {
    code: {
      type: String,
      required: [true, "Renk kodunu girmelisiniz."],
    },
    name: {
      type: String,
      required: [true, "Renk için bir isim belirtiniz."],
    },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model("Color", ColorSchema);
