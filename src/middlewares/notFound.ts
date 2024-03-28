import { Request, Response } from "express";

export default function notFoundMiddleWare(req: Request, res: Response) {
  res.status(404);

  res.json({
    error: "Not found",
    code: 404,
    route: req.path,
  });
}
