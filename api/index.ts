import app from "../src/base";
import express from "express";
import { render } from "../src/pages/server";
import fs from "fs";
import errorHandlingMiddleware from "../src/middlewares/errorHandling";
import path from "path";

const template = fs.readFileSync(
  path.resolve(__dirname, "..", "dist/client/index.html"),
  "utf-8"
);

app.use(
  express.static(path.resolve(__dirname, "..", "dist/client"), {
    index: false,
  })
);

app.use("*", async (_, res) => {
  try {
    const html = template.replace(`<!--ssr-outlet-->`, render);
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (error) {
    res.status(500).end(error);
  }
});

app.use(errorHandlingMiddleware);

export default app;
