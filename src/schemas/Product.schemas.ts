import mongoose, { Schema } from "mongoose";
import { IProduct } from "../Interfaces";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);


const ProductSchema = new Schema<IProduct>({
  category: {
    type: [String],
    required: [true, "En az bir kategori girmelisiniz."]
  },
  discountAmount: {
    type: Number,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  isDiscount: {
    type: Boolean,
    required: [true, "Lütfen indirim durumunu belirtiniz."]
  },
  metas: {
    type: [String],
    required: [true, "En az 1 adet meta bilgisi giriniz."]
  },
  name: {
    type: String,
    required: [true, "Ürün ismini yazmalısınız."]
  },
  netPrice: {
    type: Number
  },
  price: {
    type: Number,
    required: [true, "Lütfen fiyat bilgisini giriniz."]
  },
  rating: {
    type: Number,
  },
  slug: {
    type: String,
    slug: ["name", "meta"],
    slugPaddingSize: 4,
    unique: true
  },
  stockStatus: [
    {
      color: {
        type: Schema.Types.ObjectId,
        ref: "Color",
        required: true
      },
      size: {
        type: String,
        enum: ["xs", "s", "m", "l", "xl", "xxl"],
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],

}, { versionKey: false, timestamps: true });

export default mongoose.model("Product", ProductSchema);