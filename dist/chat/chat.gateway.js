"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const signup_dto_1 = require("./dto/signup.dto");
const botMessage_dto_1 = require("./dto/botMessage.dto");
const loginuser_dto_1 = require("./dto/loginuser.dto");
const translate_1 = require("@google-cloud/translate");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcryptjs");
const common_1 = require("@nestjs/common");
let createdRooms = [];
const cache_uri = "http://3.208.90.22:5000/";
const ws_uri = "https://charm10jo-skywalker.shop/";
function drl_StrToNum(language) {
    const languageArray = Object.freeze({
        en: 1,
        "zh-CN": 2,
        "zh-TW": 3,
        vi: 4,
        mn: 5,
        th: 6,
        ru: 7,
        kk: 8,
        ja: 9,
    });
    const num_language = languageArray[language];
    return { num_language };
}
let ChatGateway = class ChatGateway {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    afterInit() {
        this.nsp.adapter.on("create-room", (room) => {
            console.log(`"Room:${room}"이 생성되었습니다.`);
        });
        this.nsp.adapter.on("join-room", (room, id) => {
            console.log(`"Socket:${id}"이 "Room:${room}"에 참여하였습니다.`);
        });
        this.nsp.adapter.on("leave-room", (room, id) => {
            console.log(`"Socket:${id}"이 "Room:${room}"에서 나갔습니다.`);
        });
        this.nsp.adapter.on("delete-room", (room) => {
            const deletedRoom = createdRooms.find((createdRoom) => createdRoom === room);
            if (!deletedRoom)
                return;
            this.nsp.emit("delete-room", deletedRoom);
            createdRooms = createdRooms.filter((createdRoom) => createdRoom !== deletedRoom);
        });
        console.log("웹소켓 서버 초기화 ✅");
    }
    handleConnection(socket) {
        console.log(`${socket.id} 소켓 연결`);
    }
    handleDisconnect(socket) {
        console.log(`${socket.id} 소켓 연결 해제 ❌`);
    }
    async handlebotMessage(socket, botMessageDto) {
        const { symptoms, nmm, priority, region, language, latitude, longitude, retry, } = botMessageDto;
        const translateClient = new translate_1.v2.Translate({
            key: this.configService.get("Translate_KEY"),
        });
        const [translation] = await translateClient.translate(symptoms, {
            from: language,
            to: "ko",
        });
        let { num_language } = drl_StrToNum(language);
        let hospitalInfo;
        if (nmm === 1) {
            hospitalInfo = await (0, rxjs_1.firstValueFrom)(this.httpService.post(ws_uri, {
                priority: priority,
                division: 14,
                language: num_language,
                latitude: latitude,
                longitude: longitude,
            }));
        }
        else if (nmm == 3) {
            hospitalInfo = await (0, rxjs_1.firstValueFrom)(this.httpService.post(ws_uri, {
                priority: priority,
                division: 16,
                language: num_language,
                latitude: latitude,
                longitude: longitude,
            }));
        }
        else {
            hospitalInfo = await (0, rxjs_1.firstValueFrom)(this.httpService.post(cache_uri, {
                priority: priority,
                symptoms: translation,
                language: num_language,
                latitude: latitude,
                longitude: longitude,
            }));
        }
        socket.emit("botMessage", hospitalInfo.data.result, translation);
    }
    handleMessage(socket, { roomName, message }) {
        socket.broadcast
            .to(roomName)
            .emit("message", { username: socket.id, message });
    }
    handleRoomList() {
        return createdRooms;
    }
    handleCreateRoom(socket, roomName) {
        const exists = createdRooms.find((createdRoom) => createdRoom === roomName);
        if (exists) {
            return { success: false, payload: `${roomName} 방이 이미 존재합니다.` };
        }
        socket.join(roomName);
        createdRooms.push(roomName);
        this.nsp.emit("create-room", roomName);
        return { success: true, payload: roomName };
    }
    handleJoinRoom(socket, roomName) {
        socket.join(roomName);
        socket.emit("message", { message: `${socket.id}가 들어왔습니다.` });
        return { success: true };
    }
    handleLeaveRoom(socket, roomName) {
        socket.leave(roomName);
        socket.broadcast
            .to(roomName)
            .emit("message", { message: `${socket.id}가 나갔습니다.` });
        return { success: true };
    }
    async handleLogin(socket, loginUserDto) {
        const { Id, password } = loginUserDto;
        if (!Id || !password)
            throw new Error('입력값이 없어요. 소켓은 어떻게 통과했담?');
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(ws_uri + "login", loginUserDto));
        const token = response.data["accessToken"];
        const hashedPassword = response.data["hashedPassword"];
        if (token && (await bcrypt.compare(password, hashedPassword))) {
            const res = {
                success: true,
                token,
                nick: loginUserDto.Id,
            };
            socket.emit("login", res);
        }
        else {
            throw new common_1.UnauthorizedException('회원정보가 일치하지 않습니다.');
        }
    }
    async handleSignUp(socket, data) {
        const { Id, password, confirm, gender, birthday, korIns, privIns, phoneNumber, name, } = data;
        if (!Id || !password || !confirm)
            throw new Error("입력값이 없어요. 소켓은 어떻게 통과했담?");
        if (password !== confirm)
            throw new Error("비번이 확인란과 불일치하는데요");
        const salt = await bcrypt.genSalt(+this.configService.get("SALT"));
        const hashedPassword = await bcrypt.hash(password, salt);
        const hashedConfirm = await bcrypt.hash(confirm, salt);
        const user = {
            Id,
            hashedPassword,
            hashedConfirm,
            gender,
            birthday,
            korIns,
            privIns,
            phoneNumber,
            name,
        };
        await (0, rxjs_1.firstValueFrom)(this.httpService.post(ws_uri + "signup", user));
        socket.emit("signup", { success: true });
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Namespace)
], ChatGateway.prototype, "nsp", void 0);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("botMessage"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        botMessage_dto_1.default]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handlebotMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("message"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("room-list"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleRoomList", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("create-room"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleCreateRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("join-room"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("leave-room"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("login"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        loginuser_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleLogin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("signup"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        signup_dto_1.default]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSignUp", null);
ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: "chat",
        cors: {
            origin: ["*"],
        },
    }),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], ChatGateway);
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chat.gateway.js.map