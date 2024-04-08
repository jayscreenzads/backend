import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/roots";

export const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    errorCode: error.errorCode,
    errors: error.errors,
  });
};
