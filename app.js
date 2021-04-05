import express from "express";

import dotenv from "dotenv";
dotenv.config();
import helmet from "helmet";
import cors from "cors";

import compression from "compression";
import morgan from "morgan";
import session from "express-session";

import indexRouter from "./routes/index.js";

const app = express();

app.use(helmet());
app.use(cors());

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

app.use("/", indexRouter);

export default app;
