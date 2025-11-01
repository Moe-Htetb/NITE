import mongoose, { Schema, Types } from "mongoose";

interface Image {
  url: string;
  public_alt: string;
}
interface IProduct {
  name: string;
  description: string;
  price: number;
  instock_count: number;
  category: string;
  sizes: string[];
  colors: string[];
  images: Image[];
  is_new_arrival: boolean;
  is_feature: boolean;
  rating_count: number;
  userId: Types.ObjectId;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      required: true,
      type: String,
    },
    description: {
      required: true,
      type: String,
    },
    price: {
      required: true,
      type: Number,
    },
    instock_count: {
      required: true,
      type: Number,
    },
    category: {
      required: true,
      type: String,
    },
    sizes: {
      required: true,
      type: [String],
    },
    colors: {
      required: true,
      type: [String],
    },
    images: {
      required: true,
      type: [
        {
          url: String,
          public_alt: String,
        },
      ],
    },
    is_new_arrival: {
      required: true,
      type: Boolean,
    },
    is_feature: {
      required: true,
      type: Boolean,
    },
    rating_count: {
      required: true,
      type: Number,
    },
    userId: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);
