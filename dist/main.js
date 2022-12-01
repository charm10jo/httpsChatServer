"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const socket_adapter_1 = require("./adapters/socket.adapter");
const path_1 = require("path");
const express = require("express");
const server = express();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*'
    });
    app.useWebSocketAdapter(new socket_adapter_1.SocketIoAdapter(app));
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'static'));
    app.use(cookieParser());
    app.listen(3333, async () => {
        console.log(`HTTPS:// 3333만큼 사랑해`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map