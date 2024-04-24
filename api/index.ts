import app from "../src/base";
import express from "express";
import fs from "fs";
import errorHandlingMiddleware from "../src/middlewares/errorHandling";
import path from "path";

// const template = fs.readFileSync(
//   path.resolve(__dirname, "..", ".vercel/output/static/client/index.html"),
//   "utf-8"
// );

const template = "<html><!--ssr-outlet--></html>";

// app.use(
//   express.static(
//     path.resolve(__dirname, "..", ".vercel/output/static/client"),
//     {
//       index: false,
//     }
//   )
// );

app.use("*", async (req, res) => {
  try {
    const d = (...a: string[]) => {
      try {
        console.error("Directory", path.resolve(...a));
        console.error("Content", fs.readdirSync(path.resolve(...a)));
      } catch (error) {
        console.error("Input", ...a, "failed");
      }
    };
    d(__dirname);
    d(__dirname, "..");
    d(__dirname, "..", "src");
    d(__dirname, "..", ".vercel");
    d(__dirname, "..", ".vercel/output");
    d(__dirname, "..", ".vercel/output/client");

    // const { render } = await import(
    //   // @ts-ignore
    //   "../.vercel/output/static/server/server.mjs"
    // );
    // const rendered = (await render({ path: req.originalUrl })) as string;

    // const html = template.replace(`<!--ssr-outlet-->`, rendered);
    // res.status(200).set({ "Content-Type": "text/html" }).end(html);

    res.send("hello");
  } catch (error) {
    res.status(500).end(error);
  }
});

app.use(errorHandlingMiddleware);

export default app;
