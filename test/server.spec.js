"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
const vitest_1 = require("vitest");
const http_1 = __importDefault(require("http"));
(0, vitest_1.describe)('API Tests', () => {
    (0, vitest_1.test)("isPortOpen should return true if port is available", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, server_1.isPortOpen)(50000);
        (0, vitest_1.expect)(result).toBe(true);
    }));
    (0, vitest_1.test)("isPortOpen should return false if port is already in use", () => __awaiter(void 0, void 0, void 0, function* () {
        // 创建一个占用端口的HTTP服务器
        const server = http_1.default.createServer();
        server.listen(50000);
        const result = yield (0, server_1.isPortOpen)(50000);
        (0, vitest_1.expect)(result).toBe(false);
        server.close();
    }));
    (0, vitest_1.test)("run_server should start the server and listen on the specified port", () => __awaiter(void 0, void 0, void 0, function* () {
        const port = 50000;
        const server = (0, server_1.run_server)(port);
        // 检查服务器是否正在监听指定的端口
        const result = yield (0, server_1.isPortOpen)(port);
        (0, vitest_1.expect)(result).toBe(false);
    }));
});
