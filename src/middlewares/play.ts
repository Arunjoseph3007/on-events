import { NextFunction, Request, Response } from "express";

export default function playMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Play here

    next();
  } catch (error) {
    console.log(error);

    next(error);
  }
}
