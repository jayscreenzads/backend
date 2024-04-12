import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
dotenv.config();
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { SignUpSchema } from "./schema/user";
import { errorMiddleware } from "./middlewares/errors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var corsOptions = {
  origin: ["http://localhost:4000", "http://localhost:5000"],
  optionsSuccessStatus: 200, // For legacy browser support

  allowedHeaders: ["Content-Type", "Access-Control-Allow-Origin", "Origin"],
};

//cors
app.use(cors(corsOptions));
app.use(compression());

// Set up rate limiter: maximum of twenty requests per minute
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

const PORT = process.env.PORT || 8000;

app.use("/api", rootRouter);

export const prismaClient = new PrismaClient({
  log: ["query"],
});

app.use(errorMiddleware);

app.listen(PORT, () => console.log(`listening on ${PORT}`));
