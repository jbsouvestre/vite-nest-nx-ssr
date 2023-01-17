/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as fs from 'fs'
import * as path from 'path'
import { createServer as createViteServer } from 'vite'
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    root: path.resolve(process.cwd() + '/packages/webapp'),
    configFile: path.resolve(process.cwd() + '/packages/webapp/vite.config.ts'),
  })

  app.use(vite.middlewares)

  // app.use((...args: any[]) => {
  //   console.log("vite.requestHandler", vite.middlewares);
  //   return vite.middlewares(...args)
  // })

  app.use('*', async (req, res, next)  => {
    const url = req.originalUrl

    // console.log(`URL: ${url}`);
    //
    // // check if file exists
    // const filePath = path.join(path.resolve(process.cwd(), 'packages/webapp/'), url);
    //
    // console.log(`filePath: ${filePath}`);
    //
    // // if filePAth is in the src folder
    //
    // if(filePath.includes('packages/webapp/src') && fs.existsSync(filePath) && filePath.indexOf('html') === -1) {
    //   res.setHeader('Content-Type', 'text/javascript');
    //   //res.status(200).set({}).end(fs.readFileSync(filePath))
    //
    //   const filePathContent = fs.readFileSync(filePath, 'utf-8');
    //   res.send(filePathContent);
    //   return;
    // }

    try {
      // 1. Read index.html
      let template = fs.readFileSync(
        path.resolve(process.cwd(), 'packages/webapp/index.html'),
        'utf-8',
      )

      // 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
      //    also applies HTML transforms from Vite plugins, e.g. global preambles
      //    from @vitejs/plugin-react
      template = await vite.transformIndexHtml(url, template)
      // 3. Load the server entry. vite.ssrLoadModule automatically transforms
      //    your ESM source code to be usable in Node.js! There is no bundling
      //    required, and provides efficient invalidation similar to HMR.
      const { render } = await vite.ssrLoadModule(path.resolve(process.cwd(), 'packages/webapp/src/entry-server.tsx'))

      // 4. render the app HTML. This assumes entry-server.js's exported `render`
      //    function calls appropriate framework SSR APIs,
      //    e.g. ReactDOMServer.renderToString()
      const appHtml = await render(url)

      // 5. Inject the app-rendered HTML into the template.
      const html = template.replace(`<!--ssr-outlet-->`, appHtml)

      // 6. Send the rendered HTML back.
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace so it maps back to
      // your actual source code.
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
