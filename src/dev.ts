import { createServer } from "vite";
import app from "./base";
import fs from "fs";
import errorHandlingMiddleware from "./middlewares/errorHandling";

const PORT = 3000;
const HTML = fs.readFileSync("index.html", "utf-8");

createServer({
  server: {
    middlewareMode: true,
  },
  appType: "custom",
}).then((vite) => {
  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const template = await vite.transformIndexHtml(url, HTML);
      const { render } = await vite.ssrLoadModule("/frontend/server.tsx");
      const rendered = await render({ path: req.originalUrl });

      const html = template.replace(`<!--ssr-outlet-->`, rendered ?? "");
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (error) {
      next(error);
    }
  });

  app.use(errorHandlingMiddleware);

  app.listen(PORT, () => {
    console.log("App running on port:", PORT);
  });
});
