import app from "../src/base";
import express from "express";
import fs from "fs";
import errorHandlingMiddleware from "../src/middlewares/errorHandling";
import path from "path";
// @ts-ignore
import { render } from "../dist/server/server.mjs";

const PORT = 3000;

app.use(
  express.static(path.resolve(__dirname, "..", "dist/client"), {
    index: false,
  })
);

app.use("*", async (_, res, next) => {
  try {
    const template = fs.readFileSync(
      path.resolve(__dirname, "..", "dist/client/index.html"),
      "utf-8"
    );

    // @ts-ignore
    const html = template.replace(`<!--ssr-outlet-->`, render);
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (error) {
    next(error);
  }
});

app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log("App running on port:", PORT);
});
