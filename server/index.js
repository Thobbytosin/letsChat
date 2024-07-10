import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { errorHandler } from "./utils/error.js";
import authRouter from "./routes/auth.router.js";
import cookieParser from "cookie-parser";

dotenv.config();

// CONNECT TO DATABASE
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((error) => {
    console.log("Something went wrong: ", error);
  });

const app = express();

app.use(express.json()); //to allow json parsing
app.use(cookieParser()); // to allow cookie parsing

// ROUTES
app.use("/api/auth", authRouter);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// MIDDLEWARE FOR ERROR(INCASE THE DATA IS NOT FETCH)
app.use((err, res) => {
  console.log(err, "FROM MIDDLEWARE ERROR");
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    message,
    isError: true,
  });
});

//  MIDDLEWARE: IF ROUTE DOES NOT EXIST
app.use("*", (req, res) => {
  errorHandler(res, 404, "Not Found");
});

const PORT = 8080;

// CONNECT TO SERVER
app.listen(PORT, () => {
  console.log("Server is running at " + PORT);
});
