import { SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets"
import { Socket, Namespace } from "socket.io";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from 'rxjs';
import signupDto from './dto/signup.dto'
import BotMessageDto from "./dto/botMessage.dto";
import { LoginUserDto } from "./dto/loginuser.dto";
import { v2 } from '@google-cloud/translate';
import { ConfigService } from '@nestjs/config';

let createdRooms: string[] = [];
const cache_uri = "http://3.208.90.22:5000/"
const ws_uri = "https://charm10jo-skywalker.shop/"

function drl_StrToNum(language:string){
    const languageArray = Object.freeze({
        "en": 1,      // 영어
        "zh-CN": 2,   // 중국어 간체
        "zh-TW": 3,   // 중국어 번체
        "vi": 4,      // 베트남어
        "mn": 5,       // 몽골어
        "th": 6,      // 태국어
        "ru": 7,      // 러시아어
        "kk": 8,       // 카자흐어
        "ja": 9,      // 일본어
    });

    const num_language: number = languageArray[language]
    return { num_language }
}

@WebSocketGateway({
    namespace: "chat",
    cors: {
        origin: ['*']
    }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    constructor(
        private readonly httpService : HttpService,
        private readonly configService : ConfigService
    ) {}
    
    @WebSocketServer() nsp: Namespace
    
    afterInit() {
        this.nsp.adapter.on('create-room', (room) => {
            console.log(`"Room:${room}"이 생성되었습니다.`);
        });
      
        this.nsp.adapter.on('join-room', (room, id) => {
            console.log(`"Socket:${id}"이 "Room:${room}"에 참여하였습니다.`);
        });
    
        this.nsp.adapter.on('leave-room', (room, id) => {
            console.log(`"Socket:${id}"이 "Room:${room}"에서 나갔습니다.`);
        });
    
        this.nsp.adapter.on('delete-room', (room) => {
            const deletedRoom = createdRooms.find(
                (createdRoom) => createdRoom === room,
            );
            if (!deletedRoom) return;
        
            this.nsp.emit('delete-room', deletedRoom);
            createdRooms = createdRooms.filter(
                (createdRoom) => createdRoom !== deletedRoom,
            ); 
        });

        console.log('웹소켓 서버 초기화 ✅');
    }

    handleConnection(@ConnectedSocket() socket: Socket) {
        console.log(`${socket.id} 소켓 연결`);
    }
    
    handleDisconnect(@ConnectedSocket() socket: Socket) {
        console.log(`${socket.id} 소켓 연결 해제 ❌`);
    }
    
    // 수정
    @SubscribeMessage('botMessage') // equal "new_message" in nodejs
    async handlebotMessage(
        @ConnectedSocket() socket: Socket,
        @MessageBody() botMessageDto : BotMessageDto // type 수정 필요
    ) {
        const {
            symptoms,
            nmm,
            priority,
            language,
            latitude,
            longitude,
            retry
        } = botMessageDto;

        // 번역 api
        const translateClient = new v2.Translate({
            key : this.configService.get<string>('Translate_KEY')
        });
      
        const [translation] = await translateClient.translate(symptoms, {
            from: language,
            to: 'ko',
        });
        
        let { num_language } = drl_StrToNum(language); // by number

        let hospitalInfo;

        if(nmm === 1){
            hospitalInfo = await firstValueFrom(this.httpService.post(ws_uri,{
                "priority":priority,
                "division":14,
                "language":num_language,
                "latitude":latitude,
                "longitude":longitude
            })); // post 요청으로 web 서버 통신
        } else if (nmm == 3) {
            hospitalInfo = await firstValueFrom(this.httpService.post(ws_uri,{
                "priority":3,
                "language":num_language,
                "latitude":latitude,
                "longitude":longitude
            })); // post 요청으로 web 서버 통신
        } else{
            hospitalInfo = await firstValueFrom(this.httpService.post(cache_uri, {
                "priority":priority,
                "symptoms":translation,
                "language":num_language,
                "latitude":latitude,
                "longitude":longitude
            }));
        }             

        socket.emit('botMessage', hospitalInfo.data.result, translation);
    };

    @SubscribeMessage('message')
    handleMessage(
        @ConnectedSocket() socket: Socket,
        @MessageBody() {roomName, message}: any, // type 수정 필요
    ) {
        socket.broadcast.to(roomName).emit('message', { username: socket.id, message });
    };

    @SubscribeMessage('room-list')
    handleRoomList() {
        return createdRooms;
    };

    @SubscribeMessage('create-room')
     handleCreateRoom(
        @ConnectedSocket() socket: Socket,
        @MessageBody() roomName: string,
    ) {
        const exists = createdRooms.find((createdRoom) => createdRoom === roomName);
        if (exists) {
            return { success: false, payload: `${roomName} 방이 이미 존재합니다.` };
        }

        socket.join(roomName); // 기존에 없던 room으로 join하면 room이 생성됨
        createdRooms.push(roomName); // 유저가 생성한 room 목록에 추가
        this.nsp.emit('create-room', roomName); // 대기실 방 생성

        return { success: true, payload: roomName };
    }

    @SubscribeMessage('join-room')
    handleJoinRoom(
        @ConnectedSocket() socket: Socket,
        @MessageBody() roomName: string,
    ) {
        socket.join(roomName); // join room
        socket.emit('message', { message: `${socket.id}가 들어왔습니다.` });

        return { success: true };
    };

    @SubscribeMessage('leave-room')
    handleLeaveRoom(
        @ConnectedSocket() socket: Socket,
        @MessageBody() roomName: string,
    ) {
        socket.leave(roomName); // leave room
        socket.broadcast.to(roomName).emit('message', { message: `${socket.id}가 나갔습니다.` });

        return { success: true };
    }

    @SubscribeMessage('login')
    async handleLogin(
        @ConnectedSocket() socket: Socket,
        @MessageBody() loginUserDto: LoginUserDto
    ) {
        const response = await firstValueFrom(this.httpService.post(ws_uri + "login", loginUserDto))
        const token = response.data['accessToken'];
        const res = {
            success: true,
            token,
            nick: loginUserDto.Id
        };

        socket.emit("login", res)
    }

    @SubscribeMessage('signup')
    async handleSignUp(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: signupDto,
    ) {
        await firstValueFrom(this.httpService.post(ws_uri + "signup", data));
        socket.emit('signup', {success: true})
    }
}