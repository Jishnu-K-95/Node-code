import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import express from "express";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";

import logging from "./helpers/winston/index.js";

import Logger from "./helpers/logger/index.js";
const logger = new Logger();

import connectMongoDb from "./helpers/mongoose/index.js";

import blogRouter from "./routers/blog-route.js";

dotenv.config({
   path: path.join(__dirname + ".env"),
});

const app = express();

app.use(helmet());

app.use(morgan("combined", { stream: logging.stream }));

app.use(
   mongoSanitize({
      allowDots: true,
      replaceWith: "",
      onSanitize: ({ key, req }) => console.warn(`The request ${key} is sanitized: ${req}`),
   })
);

app.use(
   rateLimit({
      max: 2,
      windowMs: 1000 * 60 * 60,
      message: "<h1>Too many requests</h1>",
   })
);

app.use(
   cors({
      credentials: true,
      origin: (origin, callback) => callback(null, true),
   })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "200b" }));

app.use("/blog", blogRouter);

app.get("/test", (req, res, next) => {
   try {
      return res.status(200).send("<h1>Hello World from expess app!</h1>");
   } catch (error) {
      next(error);
   }
});

/**Error handling section */
app.use((error, req, res, next) => {
   logger.error(error?.message);

   return res.status(500).send("<h1>Something went wrong!</h1>");
});

export default app;
