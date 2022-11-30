import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SocketIoAdapter } from './adapters/socket.adapter';
import { join } from 'path';
import * as https from 'https';
import * as express from 'express';
import * as http from 'http';
const server = express();
import { ExpressAdapter } from '@nestjs/platform-express';
import * as fs from 'fs';
import { all } from 'axios';

// const httpsOptions = { // 최준영: 환경변수로~
//   ca: fs.readFileSync('/etc/letsencrypt/live/charm10jo-chat.shop/fullchain.pem'),
//   key: fs.readFileSync('/etc/letsencrypt/live/charm10jo-chat.shop/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/charm10jo-chat.shop/cert.pem')
// }

async function bootstrap() {
  // const app = await NestFactory.create<NestExpressApplication>(AppModule, {httpsOptions});
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // await app.init();

  app.enableCors({
    origin: '*'
  });

  app.useWebSocketAdapter(new SocketIoAdapter(app));
  app.useStaticAssets(join(__dirname, '..', 'static'));
  app.use(cookieParser());

  app.listen(3333, async () => {
      console.log(`HTTPS:// 3333만큼 사랑해`);
    });
}

bootstrap();
