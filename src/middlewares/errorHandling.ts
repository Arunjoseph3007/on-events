import type { NextFunction, Request, Response } from "express";

export default function errorHandlingMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(500).json({ message: err.message || "Something went wrong" });
}
