import type { NextFunction, Request, Response } from "express";

export default function errorHandlingMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const json = JSON.parse(err.message);
    res.status(500).json({ message: json || "Something went wrong" });
  } catch (error) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
}
