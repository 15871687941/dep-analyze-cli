"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run_server = exports.isPortOpen = exports.depAnalyze = exports.default_port = void 0;
const express_1 = __importDefault(require("express"));
const depanalyze_1 = __importDefault(require("./depanalyze"));
const net_1 = __importDefault(require("net"));
const path_1 = __importDefault(require("path"));
const consolestyle_1 = require("./consolestyle");
exports.default_port = 50000;
exports.depAnalyze = new depanalyze_1.default();
exports.depAnalyze.init();
let firstRequestDepth = Infinity;
let firstRequest = 1;
function isPortOpen(port = exports.default_port) {
    return new Promise((resolve, reject) => {
        const server = net_1.default.createServer();
        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Warning: ${consolestyle_1.consoleStyle.red}Server[http:127.0.0.1:50000] is running, please don't execute command[pkg-cli runserver]${consolestyle_1.consoleStyle.endStyle}`);
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
function run_server(port = exports.default_port) {
    const app = (0, express_1.default)();
    app.use(express_1.default.static(path_1.default.join(__dirname, "vue")));
    // GET https://localhost:50000/
    app.get("/", (res, req) => {
        req.sendFile(path_1.default.resolve(path_1.default.join(__dirname, "vue", "index.html")));
    });
    // https://localhost:50000/deplist
    app.get("/deplist", (res, rep) => {
        const depList = exports.depAnalyze.getDepList();
        rep.json(depList);
    });
    // https://localhost:50000/depgraph/glob&0.0.1/10
    app.get("/depgraph/:dep/:depth?", (res, rep) => {
        let depObj = {};
        let depth = res.params.depth || "-1";
        depth = parseInt(depth);
        // console.log(depth)
        if (depth <= 0) {
            depth = Infinity;
        }
        if (res.params.dep === "default") {
            if (firstRequest === 1) {
                // console.log(process.argv);
                process.argv.forEach((item, index) => {
                    if (item.startsWith("--depth=") || item.startsWith("-d=")) {
                        firstRequestDepth = parseInt(item.split("=")[1]);
                        if (firstRequestDepth <= 0) {
                            firstRequestDepth = Infinity;
                        }
                    }
                });
                firstRequest = firstRequest - 1;
            }
            // console.log(firstRequestDepth);
            depth = firstRequestDepth;
            let { name, version } = require(path_1.default.join(process.cwd(), "package.json"));
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
    app.get("/depgraph-simple/:dep/:depth?", (res, rep) => {
        let depObj = {};
        let depth = res.params.depth || "-1";
        depth = parseInt(depth);
        if (depth <= 0) {
            depth = Infinity;
        }
        if (res.params.dep === "default") {
            let { name, version } = require(path_1.default.join(process.cwd(), "package.json"));
            exports.depAnalyze.load(name, version, depth);
            depObj = exports.depAnalyze.toSimpleObject();
            rep.json(depObj);
        }
        else {
            try {
                let [name, version] = res.params.dep.split("&");
                exports.depAnalyze.load(name, version, depth);
                depObj = exports.depAnalyze.toSimpleObject();
                rep.json(depObj);
            }
            catch (e) {
            }
        }
    });
    app.listen(exports.default_port, () => {
        // console.log(`
        //  _____ _   ___                         
        // |     | |_|_  |___ ___ ___ ___ ___ ___ 
        // |   --|   |_  |   |   |   |   |   |   |
        // |_____|_|_|___|_|_|_|_|_|_|_|_|_|_|_|_|
        //            折腾不息 · 乐此不疲. `)
        console.log("Starting to run a server...");
        console.log(`Local:   %shttp://127.0.0.1:${exports.default_port}%s`, consolestyle_1.consoleStyle.green, consolestyle_1.consoleStyle.endStyle);
        console.log(`Function:${consolestyle_1.consoleStyle.blue}graphically display the current project dependencies information${consolestyle_1.consoleStyle.endStyle}`);
    });
}
exports.run_server = run_server;
