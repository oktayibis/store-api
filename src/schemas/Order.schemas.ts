import mongoose, { Schema } from "mongoose";
import { ORDER_STATUS, PAYMENT_METHODS, SIZES } from "../utils/constants";
import { IOrder, IOrderHistory } from "../Interfaces";

const OrderSchemas = new Schema<IOrder>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
    enums: [...SIZES],
  },
  color: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  isReturned: {
    type: Boolean,
    default: false,
  },
});

const OrderHistory = new Schema<IOrderHistory>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  stripeSecretKey: {
    type: String,
  },
  products: [OrderSchemas],
  cargoNumber: {
    type: String,
  },
  cargoCompany: {
    type: String,
    default: null,
  },
  statusExplanation: {
    type: String,
  },
  orderDate: {
    type: Date,
    default: new Date(),
  },
  status: {
    type: String,
    default: "paymentWaiting",
    enums: [...ORDER_STATUS],
  },
  paymentMethod: {
    type: String,
    enums: [...PAYMENT_METHODS],
    default: "credit-card",
  },
  totalPrice: Number,
});

export default mongoose.model("Order", OrderHistory);
