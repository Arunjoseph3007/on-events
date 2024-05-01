import { Request, Response } from "express";
import { readFileSync } from "fs";

export const frontendMiddelware = (req: Request, res: Response) => {
  const html = readFileSync("frontend/dist/index.html", "utf-8");
  res.status(200).set({ "Content-Type": "text/html" }).end(html);
};
