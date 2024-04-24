import app from "../src/base";
import express from "express";
import fs from "fs";
import errorHandlingMiddleware from "../src/middlewares/errorHandling";
import path from "path";

const template = fs.readFileSync(
  path.resolve(__dirname, "..", ".vercel/output/static/client/index.html"),
  "utf-8"
);


app.use(
  express.static(
    path.resolve(__dirname, "..", ".vercel/output/static/client"),
    {
      index: false,
    }
  )
);

app.use("*", async (req, res) => {
  try {
    console.error(fs.readdirSync(path.resolve(__dirname, "..")));
    console.error(fs.readdirSync(path.resolve(__dirname, "..", ".vercel")));
    console.error(fs.readdirSync(path.resolve(__dirname, "..", ".vercel/output")));
    console.error(
      fs.readdirSync(path.resolve(__dirname, "..", ".vercel/output/client"))
    );
    const { render } = await import(
      // @ts-ignore
      "../.vercel/output/static/server/server.mjs"
    );
    const rendered = (await render({ path: req.originalUrl })) as string;

    const html = template.replace(`<!--ssr-outlet-->`, rendered);
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (error) {
    res.status(500).end(error);
  }
});

app.use(errorHandlingMiddleware);

export default app;
