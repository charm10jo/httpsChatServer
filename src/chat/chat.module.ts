import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { HttpModule } from "@nestjs/axios"

@Module({
    imports: [HttpModule],
    providers: [ChatGateway], // 외부에서 이 module을 사용할 수 있도록.
    exports: [ChatGateway] // module 내부의 eventsgateway를 외부에서 사용할 수 있도록.
  })
  export class ChatModule {}