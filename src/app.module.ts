import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { ChatGateway } from '../src/chat/chat.gateway';
require('dotenv').config()

@Module({
  imports: [
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
