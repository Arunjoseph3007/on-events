import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

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

  res.status(500).json({ message: err.message || "Something went wrong" });
}
