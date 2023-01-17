import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ServeStaticModule} from "@nestjs/serve-static";

console.log(process.cwd());

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: process.cwd() + '/packages/webapp',
    // })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
