import express from "express";
import cors from "cors";
// import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDb } from "./db/connectDb";
import userRouter from "./routes/userRoute";
import { errorHandler } from "./middlewares/errorHandler";
import productRouter from "./routes/productRoute";

//app setup
// dotenv.config({
//   path: ".env",
// });
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_LOCAL_URL,
    credentials: true,
  }),
);

//route setup
app.use("/api/v1/", userRouter);
app.use("/api/v1/", productRouter);

//error handler
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  connectDb();
  console.log(`Server is Running at http://localhost:${port}`);
});
