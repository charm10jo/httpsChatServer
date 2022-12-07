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

async function drl_StrToNum(regionByStrType:string, language:string){
      const addressArray = Object.freeze({
        "강남구": 0,
        "강동구": 1,
        "강북구": 2,
        "강서구": 3,
        "관악구": 4,
        "광진구": 5,
        "구로구": 6,
        "금천구": 7,
        "노원구": 8,
        "도봉구": 9,
        "동대문구": 10,
        "동작구": 11,
        "마포구": 12,
        "서대문구": 13,
        "서초구": 14,
        "성동구": 15,
        "성북구": 16,
        "송파구": 17,
        "양천구": 18,
        "영등포구": 19,
        "용산구": 20,
        "은평구": 21,
        "종로구": 22,
        "중구": 23,
        "중랑구": 24,
      });
    
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

    const num_address: number = addressArray[regionByStrType]
    const num_language: number = languageArray[language]

    return { num_address, num_language }
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
            region,
            language
        } = botMessageDto;

        const divisions = Object.freeze({
            "내과": 0,
            "외과": 1,
            "비뇨의학과": 2,
            "산부인과": 3,
            "성형외과": 4,
            "소아과": 5,
            "신경과": 6,
            "안과": 7,
            "이비인후과": 8,
            "재활의학과": 9,
            "정신건강의학과": 10,
            "정형외과": 11,
            "치과": 12,
            "피부과": 13,
            '약국': 14,
            "한방과": 15,
            "응급실": 16
          });

        // 번역 api
        const translateClient = new v2.Translate({
            key : this.configService.get<string>('Translate_KEY')
        });
      
        const [translation] = await translateClient.translate(symptoms, {
            from: language,
            to: 'ko',
        });
        console.log(translation)
        let { num_address, num_language } = await drl_StrToNum(region, language); // by number

        let num_division: number;
    
        if(nmm === 1){
            num_division = 14
        } else if (nmm == 3) {
            num_division = 16
        } else{
            const my_division:Object = await firstValueFrom(this.httpService.post("http://54.242.143.192:5000/predict", {
                symptoms: translation
            }));
            console.log(my_division['data'])
            num_division = divisions[my_division['data']]
        }     
        console.log(num_division)
        
        const res = await firstValueFrom(this.httpService.get(`https://charm10jo-skywalker.shop/${num_division}/${num_language}/${priority}`)); // 수정: WS 주소 입력, div, addr, lang, priority(query) 순서.
        
        const hospitalInfo = res.data.slice(0,9);
        console.log(hospitalInfo)
        socket.emit('botMessage', hospitalInfo, translation);
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
        const response = await firstValueFrom(this.httpService.post("https://charm10jo-skywalker.shop/login", loginUserDto))
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
        await firstValueFrom(this.httpService.post("https://charm10jo-skywalker.shop/signup", data));
        socket.emit('signup', {success: true})
    }
}