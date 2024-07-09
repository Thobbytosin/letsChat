import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

const PORT = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to Database successfully!!");
    app.listen(PORT, () => {
      console.log("Server is running at " + PORT);
    });
  })
  .catch((error) => {
    console.log("Something went wrong: ", error);
  });
