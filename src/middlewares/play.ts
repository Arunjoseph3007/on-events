import { NextFunction, Request, Response } from "express";

export default function playMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Play here
  next();
}
