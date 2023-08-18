"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run_server = exports.isPortOpen = exports.depAnalyze = void 0;
const express_1 = __importDefault(require("express"));
const depanalyze_1 = __importDefault(require("./depanalyze"));
const net_1 = __importDefault(require("net"));
const path_1 = __importDefault(require("path"));
const default_port = 50000;
exports.depAnalyze = new depanalyze_1.default();
exports.depAnalyze.init();
function isPortOpen(port = default_port) {
    return new Promise((resolve, reject) => {
        const server = net_1.default.createServer();
        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(false); // 端口被占用
            }
            else {
                reject(err); // 其他错误
            }
        });
        server.once('listening', () => {
            server.close();
            resolve(true); // 端口可用
        });
        server.listen(port);
    });
}
exports.isPortOpen = isPortOpen;
function run_server(port = default_port) {
    const app = (0, express_1.default)();
    app.use(express_1.default.static("vue"));
    // GET https://localhost:50000/
    app.get("/", (res, req) => {
        req.sendFile(path_1.default.resolve("./vue/index.html"));
    });
    // https://localhost:50000/deplist
    app.get("/deplist", (res, rep) => {
        exports.depAnalyze.init();
        const depList = exports.depAnalyze.getDepList();
        rep.json(depList);
    });
    // https://localhost:50000/depgraph/glob&0.0.1?depth=10
    app.get("/depgraph/:dep/:depth", (res, rep) => {
        let depObj = {};
        let depth = res.params.depth || "-1";
        depth = parseInt(depth);
        if (depth < 0) {
            depth = Infinity;
        }
        if (res.params.dep === "default") {
            let { name, version } = require("./package.json");
            exports.depAnalyze.load(name, version, depth);
            depObj = exports.depAnalyze.toObject();
            rep.json(depObj);
        }
        else {
            try {
                let [name, version] = res.params.dep.split("&");
                exports.depAnalyze.load(name, version, depth);
                depObj = exports.depAnalyze.toObject();
                rep.json(depObj);
            }
            catch (e) {
            }
        }
    });
    app.listen(default_port, () => {
        console.log(`start a server of http://localhost:${default_port}`);
    });
}
exports.run_server = run_server;
