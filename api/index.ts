import app from "../src/base";
import express from "express";
import fs from "fs";
import errorHandlingMiddleware from "../src/middlewares/errorHandling";
import path from "path";

const PORT = 3000;

app.use(
  express.static(path.resolve(__dirname, "client"), {
    index: false,
  })
);

app.use("*", async (_, res) => {
  try {
    console.log(fs.readdirSync(path.resolve(__dirname, "client")));
    // const template = fs.readFileSync(
    //   path.resolve(__dirname, "client/index.html"),
    //   "utf-8"
    // );

    // // @ts-ignore
    // const { render } = await import("../dist/server/server.mjs");
    // // @ts-ignore
    // const html = template.replace(`<!--ssr-outlet-->`, render);
    // res.status(200).set({ "Content-Type": "text/html" }).end(html);
    res.send('hello')
  } catch (error) {
    res.status(500).end(error);
  }
});

app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log("App running on port:", PORT);
});
