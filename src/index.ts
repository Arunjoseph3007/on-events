import app from "./base";
import express from "express";
import fs from "fs";
import errorHandlingMiddleware from "./middlewares/errorHandling";
import path from "path";

const PORT = 3000;

app.use(
  express.static(path.resolve(__dirname, "client"), {
    index: false,
  })
);

app.use("*", async (req, res, next) => {
  try {
    const template = fs.readFileSync(
      path.resolve(__dirname, "client/index.html"),
      "utf-8"
    );

    // @ts-ignore
    const { render } = await import("../dist/server/server.mjs");
    const rendered = await render({ path: req.originalUrl });

    const html = template.replace(`<!--ssr-outlet-->`, rendered);
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (error) {
    next(error);
  }
});

app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log("App running on port:", PORT);
});
