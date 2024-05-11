import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import UnAuthorizedError from "../error/unauthorized";
import NotFoundError from "../error/notFound";
import CustomHttpError from "../error/httpError";

export default function errorHandlingMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ZodError) {
    const json = JSON.parse(err.message);
    return res.status(500).json({
      error: json || "Something went wrong",
      message: "Data validation error",
    });
  }

  if (err instanceof UnAuthorizedError) {
    return res.status(401).json({
      error: err.error,
      message: err.message,
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error: err,
      message: err.message,
    });
  }

  if (err instanceof CustomHttpError) {
    return res.status(err.code).json({
      error: err,
      message: err.message,
    });
  }

  res.status(500).json({ message: err.message || "Something went wrong" });
}
