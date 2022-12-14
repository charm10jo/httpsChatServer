import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets";
import { Socket, Namespace } from "socket.io";
import { HttpService } from "@nestjs/axios";
import signupDto from "./dto/signup.dto";
import BotMessageDto from "./dto/botMessage.dto";
import { LoginUserDto } from "./dto/loginuser.dto";
import { ConfigService } from "@nestjs/config";
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly httpService;
    private readonly configService;
    constructor(httpService: HttpService, configService: ConfigService);
    nsp: Namespace;
    afterInit(): void;
    handleConnection(socket: Socket): void;
    handleDisconnect(socket: Socket): void;
    handlebotMessage(socket: Socket, botMessageDto: BotMessageDto): Promise<void>;
    handleMessage(socket: Socket, { roomName, message }: any): void;
    handleRoomList(): string[];
    handleCreateRoom(socket: Socket, roomName: string): {
        success: boolean;
        payload: string;
    };
    handleJoinRoom(socket: Socket, roomName: string): {
        success: boolean;
    };
    handleLeaveRoom(socket: Socket, roomName: string): {
        success: boolean;
    };
    handleLogin(socket: Socket, loginUserDto: LoginUserDto): Promise<void>;
    handleSignUp(socket: Socket, data: signupDto): Promise<void>;
}
