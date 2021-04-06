import express from "express";

import dotenv from "dotenv";
dotenv.config();
import helmet from "helmet";
import cors from "cors";

import compression from "compression";
import morgan from "morgan";
import session from "express-session";

import mongoose from "mongoose";

import authRouter from "./routes/auth.js";

const app = express();

if (process.env.ENV === "production") {
  app.use(helmet());
  app.use(cors());
}

app.use(compression());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    key: process.env.SESSION_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: true,
      exprires: new Date(Date.now() + 60 * 60 * 1000),
    },
  })
);

mongoose.connect(
  process.env.MONGO_CONNECTION_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    }
  }
);

app.use("/", authRouter);

export default app;
