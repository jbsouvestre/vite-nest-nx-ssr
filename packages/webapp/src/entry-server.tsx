import ReactDOMServer from 'react-dom/server'
import { StaticRouter, StaticRouterProps } from 'react-router-dom/server'
import Main from "./main";

export function render(url: StaticRouterProps["location"]) {
  return ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <Main />
    </StaticRouter>
  )
}
