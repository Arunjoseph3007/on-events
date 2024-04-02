import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import UnAuthorizedError from "../error/unauthorized";

export default function errorHandlingMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ZodError) {
    const json = JSON.parse(err.message);
    res.status(500).json({
      error: json || "Something went wrong",
      message: "Data validation error",
    });
    return;
  }

  if (err instanceof UnAuthorizedError) {
    res.status(401).json({
      error: err.error,
      message: err.message,
    });
    return;
  }

  res.status(500).json({ message: err.message || "Something went wrong" });
}
