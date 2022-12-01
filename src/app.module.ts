import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { ChatGateway } from '../src/chat/chat.gateway';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true,
      envFilePath : '.translate.env'
    }),
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
