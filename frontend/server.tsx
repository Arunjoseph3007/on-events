import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import Router from "./router";

type TRenderProps = { path: string };

export const render = ({ path }: TRenderProps) => {
  return renderToString(
    <StaticRouter location={path}>
      <Router />
    </StaticRouter>
  );
};
