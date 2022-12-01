import { IoAdapter } from '@nestjs/platform-socket.io';
export declare class SocketIoAdapter extends IoAdapter {
    createIOServer(port: number, options?: any): any;
}
