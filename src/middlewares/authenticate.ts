import { NextFunction, Request, Response } from "express";
import UnAuthorizedError from "../error/unauthorized";
import { verifyToken } from "../accounts/utils";

declare module "express-serve-static-core" {
  interface Request {
    user: {
      id: number;
      email: string;
      name: string;
    };
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      throw new UnAuthorizedError("Authorization token missing in request");

    const [bearer, token, ...extra] = authHeader.split(" ");
    if (!token || bearer != "Bearer" || extra.length > 0)
      throw new UnAuthorizedError("Authorization token missing in request");

    req.user = await verifyToken(token);

    next();
  } catch (error) {
    next(error);
  }
};