import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDb } from "./db/connectDb";

dotenv.config({
  path: ".env",
});
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_LOCAL_URL,
    credentials: true,
  })
);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  connectDb();
  console.log(`Listening on port ${port}`);
});
