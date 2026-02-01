import mongoose from "mongoose";
import { products, users } from "./data";
import { Product } from "../models/product.model";
import { User } from "../models/user.model";

async function seed() {
  try {
    await mongoose.connect("mongodb://localhost:27017/NITE");
    await Product.deleteMany({});
    await Product.insertMany(products);
    await User.insertMany(users);
    console.log("✅ Products and Users seeded!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
