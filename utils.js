"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDepPkgVerList = exports.getGlobalDepConfObj = exports.getLocalDepConfObj = exports.dependencyInit = exports.readModuleDependencies = exports.globalDependencies = exports.localDependencies = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const versionmanage_1 = require("./versionmanage");
const globalModulesPath = path.resolve(process.execPath, '../../lib/node_modules');
exports.localDependencies = new Map();
exports.globalDependencies = new Map();
// 使用递归遍历算法，遍历给定目录下的所有依赖，并根据给定参数在相应列表中
function readModuleDependencies(base_name = process.cwd(), isLocal = true) {
    if (!fs.existsSync(base_name)) {
        return;
    }
    if (!fs.statSync(base_name).isDirectory()) {
        return;
    }
    const pkgJsonFilePath = path.join(base_name, 'package.json');
    if (fs.existsSync(pkgJsonFilePath)) {
        try {
            // 一般本项目的依赖包的开发依赖都不会安装，所以使用devDependencies没有意义
            const { name, version, dependencies } = require(pkgJsonFilePath);
            // let {name, version, devDependencies} = require(pkgJsonFilePath);
            // if(name==="packagedepgraph"){
            //     console.log(name, version, devDependencies);
            // }
            if (name && version) {
                isLocal
                    ? exports.localDependencies.set(name + '&' + version, {
                        name,
                        version,
                        dependencies,
                    })
                    : exports.globalDependencies.set(name + '&' + version, {
                        name,
                        version,
                        dependencies,
                    });
            }
        }
        catch (e) {
            // console.error(`Warning:${pkgJsonFilePath}解析有问题，已忽略！`);
        }
    }
    const dependencyList = fs.readdirSync(base_name);
    // let packageConfig: DepConfObj;
    dependencyList.forEach((item) => {
        const subDir = path.join(base_name, item);
        readModuleDependencies(subDir, isLocal);
    });
}
exports.readModuleDependencies = readModuleDependencies;
function dependencyInit() {
    readModuleDependencies();
    readModuleDependencies(globalModulesPath, false);
}
exports.dependencyInit = dependencyInit;
// 给定参数满足语义化版本规范就可以了
function getLocalDepConfObj(packageName, version, isLocal = true) {
    let depConfObj = {
        name: '',
        version: '',
        dependencies: undefined,
    };
    let key = '';
    const fullPackage = (0, versionmanage_1.analyseVersion)(packageName, version);
    version =
        fullPackage.reg +
            [fullPackage.firstVer, fullPackage.secondVer, fullPackage.fixVer].join('.');
    for (key of Array.from(exports.localDependencies.keys())) {
        if ((0, versionmanage_1.isEqualVersion)(key.split('&').at(0), key.split('&').at(1), fullPackage.packageName, version)) {
            depConfObj = (isLocal ? exports.localDependencies : exports.globalDependencies).get(key);
            break;
        }
    }
    if (depConfObj.name === '' && depConfObj.version === '') {
        for (key of Array.from(exports.localDependencies.keys())) {
            // 为了能跑起来，先舍弃一部分，把保证包名一致就可以了
            if (key.split('&').at(0) === packageName) {
                depConfObj = (isLocal ? exports.localDependencies : exports.globalDependencies).get(key);
                // console.error(`${consoleStyle.red}${packageName}:${version} 该版本的模块不存在，正在返回相同模块名而版本号不同的数据${consoleStyle.endStyle}`);
                break;
            }
        }
        if (depConfObj.name === '' && depConfObj.version === '') {
            // console.log(packageName, version)
            throw new Error(`[${packageName}]该模块不存在，可能是包名与package.json中的name字段不匹配导致的`);
        }
    }
    return depConfObj;
}
exports.getLocalDepConfObj = getLocalDepConfObj;
function getGlobalDepConfObj(packageName, version, isLocal = false) {
    let depConfObj = {
        name: '',
        version: '',
        dependencies: undefined,
    };
    let key = '';
    const fullPackage = (0, versionmanage_1.analyseVersion)(packageName, version);
    version =
        fullPackage.reg +
            [fullPackage.firstVer, fullPackage.secondVer, fullPackage.fixVer].join('.');
    for (key of Array.from((isLocal ? exports.localDependencies : exports.globalDependencies).keys())) {
        if ((0, versionmanage_1.isEqualVersion)(key.split('&').at(0), key.split('&').at(1), fullPackage.packageName, version)) {
            depConfObj = (isLocal ? exports.localDependencies : exports.globalDependencies).get(key);
            break;
        }
    }
    if (depConfObj.name === '' && depConfObj.version === '') {
        for (key of Array.from(exports.localDependencies.keys())) {
            // 为了能跑起来，先舍弃一部分，把保证包名一致就可以了
            if (key.split('&').at(0) === packageName) {
                depConfObj = (isLocal ? exports.localDependencies : exports.globalDependencies).get(key);
                // console.error(`${consoleStyle.red}${packageName}:${version} 该版本的模块不存在，正在返回相同模块名而版本号不同的数据${consoleStyle.endStyle}`);
                break;
            }
        }
        if (depConfObj.name === '' && depConfObj.version === '') {
            // console.log(packageName, version)
            throw new Error(`[${packageName}]该模块不存在，可能是包名与package.json中的name字段不匹配导致的`);
        }
    }
    return depConfObj;
}
exports.getGlobalDepConfObj = getGlobalDepConfObj;
function getDepPkgVerList(isLocal = true) {
    const mapList = [];
    let packageName = '';
    let version = '';
    let key = '';
    let map;
    for (key of Array.from(isLocal ? exports.localDependencies.keys() : exports.globalDependencies.keys())) {
        packageName = key.split('&').at(0);
        version = key.split('&').at(1);
        map = { packageName, version };
        mapList.push(map);
    }
    return mapList;
}
exports.getDepPkgVerList = getDepPkgVerList;
// function checkVersion(){
//     readModuleDependencies();
//     let key:string = "";
//     let depConfObj:DepConfObj;
//     for(key of localDependencies.keys()){
//         depConfObj = localDependencies.get(key) as DepConfObj;
//         const dependencies:{[key:string]:string} = depConfObj["dependencies"] as {[key:string]:string};
//         let k1:string="";
//         for(k1 in dependencies){
//             const pattern:RegExp = /^[\^\~]?\d{1,}\.\d{1,}\.\d{1,}$/;
//             const version:string = dependencies[k1];
//             if(!pattern.test(version)){
//                 console.log(depConfObj);
//                 console.log(k1, version);
//             }
//         }
//     }
// }
// checkVersion();
/*

npm:string-width@^4.2.0
npm:strip-ansi@^6.0.1
npm:wrap-ansi@^7.0.0
*
*
*
*
*
*
*
*
*
*
^1
*
*
*
*
^5.0.0 || ^6.0.2 || ^7.0.0
>= 2.1.2 < 3
^9.1.1 || ^10.0.0
^5.0.0 || ^6.0.2 || ^7.0.0
*/
