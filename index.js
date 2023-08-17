#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const server_2 = require("./server");
const utils_1 = require("./utils");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// 判断端口是否被占用，没有被占用则打开服务器，被占用则不执行
(0, server_1.isPortOpen)().then((isOpen) => {
    if (isOpen) {
        (0, server_1.run_server)();
    }
}).catch((err) => {
    console.error(err);
});
// 命令行解析执行
let depth = -1;
let jsonPath = "";
let pkg = "";
let ver = "";
let helpFlag = false;
// 帮助提示信息 待填写
const helpInfo = `你好`;
try {
    if (process.argv[2] === "help" || process.argv.length === 0) {
        console.log(helpInfo);
    }
    else if (process.argv[2] === "analyze") {
        const argv = process.argv.slice(3);
        argv.forEach((item, index) => {
            if (item.startsWith("--depth=")) {
                depth = parseInt(item.split("=")[1]);
            }
            else if (item.startsWith("--json=")) {
                jsonPath = item.split("=")[1];
            }
            else if (item.startsWith("--package=")) {
                pkg = item.split("=")[1];
            }
            else if (item.startsWith("--version=")) {
                ver = item.split("=")[1];
            }
            else if (item.startsWith("--help")) {
                helpFlag = true;
            }
        });
        if (helpFlag) {
            console.log(helpInfo);
        }
        else {
            if (depth < 0) {
                depth = Infinity;
            }
            if (pkg === "" && ver === "") {
                if (fs_1.default.existsSync(path_1.default.join(process.cwd(), "package.json"))) {
                    let { name, version } = require(path_1.default.join(process.cwd(), "package.json"));
                    pkg = name;
                    ver = version;
                }
                else {
                    throw new Error("请在nodejs项目根路径下执行[analyze-cli]命令");
                }
            }
            else if (pkg !== "" && ver === "") {
            }
            else {
                throw new Error("命令格式--package选项和--version选项必须一起不出现或者一起出现");
            }
            let depConfObj = (0, utils_1.getLocalDepConfObj)(pkg, ver);
            server_2.depAnalyze.load(depConfObj.name, depConfObj.version, depth);
            console.log(server_2.depAnalyze.toObject());
            if (jsonPath !== "") {
                if (jsonPath.endsWith(".json")) {
                    server_2.depAnalyze.save(jsonPath);
                }
            }
        }
    }
    else {
        throw new Error(`Error:命令格式不规范：\n${helpInfo}`);
    }
}
catch (e) {
    console.error(e.message);
}
