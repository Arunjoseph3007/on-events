import { Request, Response } from "express";
import { readFileSync } from "fs";

const html = readFileSync("frontend/dist/index.html", "utf-8");

export const frontendMiddelware = (req: Request, res: Response) => {
  res.status(200).set({ "Content-Type": "text/html" }).end(html);
};
