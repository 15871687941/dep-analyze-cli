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
exports.default_port = 8080;
exports.depAnalyze = new depanalyze_1.default();
exports.depAnalyze.init();
let firstRequestDepth = Infinity;
let firstRequest = 1;
function isPortOpen(port = exports.default_port) {
    return new Promise((resolve, reject) => {
        const server = net_1.default.createServer();
        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(
                // `Warning: ${consoleStyle.red}Server[http:127.0.0.1:8080] is running, please don't execute command[pkg-cli runserver]${consoleStyle.endStyle}`,
                );
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
function run_server(pkgName = "", ver = "", port = exports.default_port) {
    const app = (0, express_1.default)();
    app.use(express_1.default.static(path_1.default.join(__dirname, 'vue')));
    // GET https://localhost:8080/
    app.get('/', (res, req) => {
        req.sendFile(path_1.default.resolve(path_1.default.join(__dirname, 'vue', 'index.html')));
    });
    // https://localhost:8080/deplist
    app.get('/deplist', (res, rep) => {
        const depList = exports.depAnalyze.getDepList();
        rep.json(depList);
    });
    // https://localhost:8080/depgraph/glob&0.0.1/10
    app.get('/depgraph/:dep/:depth?', (res, rep) => {
        let depObj = {};
        let depth = res.params.depth || '-1';
        depth = parseInt(depth);
        // console.log(depth)
        if (depth <= 0) {
            depth = Infinity;
        }
        try {
            if (res.params.dep === 'default') {
                if (firstRequest === 1) {
                    // console.log(process.argv);
                    process.argv.forEach((item) => {
                        if (item.startsWith('--depth=') || item.startsWith('-d=')) {
                            firstRequestDepth = parseInt(item.split('=')[1]);
                            if (firstRequestDepth <= 0) {
                                firstRequestDepth = Infinity;
                            }
                        }
                    });
                    firstRequest = firstRequest - 1;
                }
                // console.log(firstRequestDepth);
                depth = firstRequestDepth;
                let { name, version } = require(path_1.default.join(process.cwd(), 'package.json'));
                if (pkgName !== "" && ver !== "") {
                    name = pkgName;
                    version = ver;
                }
                // console.log(name ,version);
                exports.depAnalyze.load(name, version, depth);
                depObj = exports.depAnalyze.toObject();
                rep.json(depObj);
            }
            else {
                let [name, version] = res.params.dep.split('&');
                if (pkgName !== "" && ver !== "") {
                    name = pkgName;
                    version = ver;
                }
                exports.depAnalyze.load(name, version, depth);
                depObj = exports.depAnalyze.toObject();
                rep.json(depObj);
            }
        }
        catch (e) {
            console.log(e.message);
        }
    });
    app.get('/depgraph-simple/:dep/:depth?', (res, rep) => {
        let depObj = {};
        let depth = res.params.depth || '-1';
        depth = parseInt(depth);
        if (depth <= 0) {
            depth = Infinity;
        }
        try {
            if (res.params.dep === 'default') {
                const { name, version } = require(path_1.default.join(process.cwd(), 'package.json'));
                exports.depAnalyze.load(name, version, depth);
                depObj = exports.depAnalyze.toSimpleObject();
                rep.json(depObj);
            }
            else {
                const [name, version] = res.params.dep.split('&');
                exports.depAnalyze.load(name, version, depth);
                depObj = exports.depAnalyze.toSimpleObject();
                rep.json(depObj);
            }
        }
        catch (e) {
            console.log(e.message);
        }
    });
    app.listen(port, () => {
        console.log('Starting to run a server...');
        console.log(`Local:   %shttp://127.0.0.1:${port}%s`, consolestyle_1.consoleStyle.green, consolestyle_1.consoleStyle.endStyle);
        console.log(`Function:${consolestyle_1.consoleStyle.blue}graphically display the current project dependencies information${consolestyle_1.consoleStyle.endStyle}`);
    });
}
exports.run_server = run_server;
