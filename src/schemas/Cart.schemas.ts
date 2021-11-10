import mongoose, { Schema } from "mongoose";
import { ICart } from "../Interfaces";
import { SIZES } from "../utils/constants";

const CartSchema = new Schema<ICart>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    enum: SIZES,
  },
  color: Schema.Types.ObjectId,
});

export default mongoose.model("Cart", CartSchema);
