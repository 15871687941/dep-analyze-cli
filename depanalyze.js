"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graph_1 = __importDefault(require("./graph"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("./utils");
class DepAnalyze {
    constructor() {
        this.depGraph = new graph_1.default();
        this.depth = 0;
        this.entryPackage = "";
        this.entryVersion = "";
        this.isCircle = false;
        this.circcleDepList = [];
        this.isExistMulPack = false;
        this.mulPackList = [];
        this.helpQueue = [];
        this.allDepList = [];
        this.visited = [];
        this.isLocal = true;
        this.getDepConfigObj = utils_1.getLocalDepConfObj;
        this.isExecInit = false;
        this.isExecLoad = false;
    }
    init(isLocal = true) {
        (0, utils_1.dependencyInit)();
        this.isLocal = isLocal;
        this.getDepConfigObj = isLocal ? utils_1.getLocalDepConfObj : utils_1.getGlobalDepConfObj;
        this.isExecInit = true;
    }
    load(entryPackage, entryVersion, depthLimited) {
        if (!this.isExecInit) {
            throw new Error("请先执行init方法，初始化环境");
        }
        this.entryPackage = entryPackage;
        this.entryVersion = entryVersion;
        this.readDepsGraph(entryPackage, entryVersion, depthLimited);
        this.isExecLoad = true;
    }
    // 获取入口模块的依赖图
    // 深度优先遍历
    readDepsGraph(ep, ev, depthLimited) {
        if (depthLimited <= 0) {
            return;
        }
        // 获取该模块对应版本的依赖对象{name:ep, version:ev, dependencies:{}}
        let depConfObj = this.getDepConfigObj(ep, ev);
        // 构造节点 name&version
        let node = depConfObj.name + "&" + depConfObj.version;
        // 添加节点
        this.depGraph.addNode(node);
        depthLimited = depthLimited - 1;
        if (!this.allDepList.includes(node)) {
            this.allDepList.push(node);
        }
        this.visited[this.allDepList.indexOf(node)] = true;
        this.helpQueue.push(node);
        this.depth = this.helpQueue.length > this.depth ? this.helpQueue.length : this.depth;
        // 检测是否为叶子节点
        if (depConfObj.dependencies === undefined) {
            this.helpQueue.pop();
            return;
        }
        // 如果该模块有依赖对象，则遍历依赖对象，将每个依赖添加为节点，且添加该模块节点的邻接表
        let deps = new Map(Object.entries(depConfObj.dependencies));
        let depName = "";
        let verName = "";
        let depConfObj1;
        let depNode = "";
        for (depName of deps.keys()) {
            verName = deps.get(depName);
            depConfObj1 = this.getDepConfigObj(depName, verName);
            depNode = depConfObj1.name + "&" + depConfObj1.version;
            this.depGraph.addNode(depNode);
            if (!this.allDepList.includes(node)) {
                this.allDepList.push(node);
            }
            this.depGraph.addEdge(node, depNode);
        }
        let i = 0;
        for (let w = this.depGraph.getFirstNeighbor(node); w !== undefined; w = this.depGraph.getNextNeighbor(node, w)) {
            // 即将遍历w节点
            // 解决循环依赖问题
            if (this.helpQueue.includes(w)) {
                this.isCircle = true;
                const startIndex = this.helpQueue.indexOf(w);
                this.helpQueue.push(w);
                const circleDep = this.helpQueue.slice(startIndex);
                this.circcleDepList.push(circleDep);
                this.helpQueue.pop();
                this.depth = this.helpQueue.length > this.depth ? this.helpQueue.length : this.depth;
                continue;
            }
            // 解决多次访问一个节点的问题
            if (!this.visited[this.allDepList.indexOf(w)]) {
                this.readDepsGraph(w.split("&").at(0), w.split("&").at(1), depthLimited);
            }
        }
        this.helpQueue.pop();
    }
    // // 层次遍历
    // // --depth
    // getOrderedDepthGraph(depth:number):GraphByAdjacencyList{
    //     if(!this.isExecInit || !this.isExecLoad){
    //         throw new Error("请先调用init和load方法");
    //     }
    //     if(depth >= this.depth || depth < 0){
    //         depth = this.depth;
    //     }
    //     let orderedDepthGraph:GraphByAdjacencyList = new GraphByAdjacencyList();
    //     let entryNode:string = this.entryPackage + "&" + this.entryVersion;
    //     orderedDepthGraph.addNode(entryNode);
    //     depth -= 1;
    //     this.helpQueue.push(entryNode);
    //     while(this.helpQueue.length !== 0 && depth > 0){
    //         let len = this.helpQueue.length;
    //         for(let i=0;i<len;i++){
    //             const depNode = this.helpQueue.pop() as string;
    //             this.depGraph.getNeighbors(depNode)?.forEach((item, index)=>{
    //                 if(this.helpQueue.indexOf(item) < 0){
    //                     this.helpQueue.push(item);
    //                 }
    //                 orderedDepthGraph.addNode(item);
    //                 orderedDepthGraph.addEdge(depNode, item);
    //             });
    //         }
    //         depth -= 1;
    //     }
    //     if(!this.isExecInit || !this.isExecLoad){
    //         throw new Error("请先调用init和load方法");
    //     }
    //     return orderedDepthGraph;
    // }
    getDepth() {
        if (!this.isExecInit || !this.isExecLoad) {
            throw new Error("请先调用init和load方法");
        }
        return this.depth;
    }
    hasCircleDep() {
        if (!this.isExecInit || !this.isExecLoad) {
            throw new Error("请先调用init和load方法");
        }
        return this.isCircle;
    }
    hasMulPack() {
        if (!this.isExecInit || !this.isExecLoad) {
            throw new Error("请先调用init和load方法");
        }
        let nodes = this.depGraph.getNodes();
        let pNodes = [];
        if (nodes.length < 2) {
            return this.isExistMulPack;
        }
        nodes = nodes.sort();
        nodes.forEach((item, index) => {
            pNodes.push(item.split("&").at(0));
        });
        let startPos = 0;
        for (let i = 1; i < pNodes.length; i++) {
            if (pNodes[startPos] !== pNodes[i]) {
                if ((i - startPos) >= 2) {
                    this.mulPackList.push(new Set(nodes.slice(startPos, i)));
                }
                startPos = i;
            }
        }
        this.isExistMulPack = this.mulPackList.length > 0;
        return this.isExistMulPack;
    }
    getDepList() {
        let depList = (0, utils_1.getDepPkgVerList)();
        let depsString = [];
        for (let index in depList) {
            const dep = depList[index];
            depsString.push(`${depList[index]["packageName"]}:${depList[index].version}`);
        }
        depsString.sort();
        return depsString;
    }
    toObject() {
        if (!this.isExecInit || !this.isExecLoad) {
            throw new Error("请先调用init和load方法");
        }
        const links = [];
        const mapNodes = new Map();
        mapNodes.set(`${this.entryPackage}&${this.entryVersion}`, 0);
        for (let source of this.depGraph.getNodes()) {
            for (let target of this.depGraph.getNeighbors(source)) {
                links.push({ source, target });
                if (mapNodes.has(target)) {
                    mapNodes.set(target, mapNodes.get(target) + 1);
                }
                else {
                    mapNodes.set(target, 1);
                }
            }
        }
        const nodes = Array.from(mapNodes, ([key, val]) => {
            return { name: key, count: val };
        });
        this.depGraph = new graph_1.default();
        return {
            entryPackageName: this.entryPackage,
            entryVersion: this.entryVersion,
            nodeCount: this.allDepList.length,
            nodes: nodes,
            links: links,
            depth: this.depth,
            isCircle: this.isCircle,
            circleDepList: this.circcleDepList,
            isMulPackage: this.isExistMulPack,
            mulPackageList: this.mulPackList
        };
    }
    toSimpleObject() {
        if (!this.isExecInit || !this.isExecLoad) {
            throw new Error("请先调用init和load方法");
        }
        return {
            entryPackageName: this.entryPackage,
            entryVersion: this.entryVersion,
            nodeCount: this.allDepList.length,
            depth: this.depth,
            isCircle: this.isCircle,
            circleDepList: this.circcleDepList,
            isMulPackage: this.isExistMulPack,
            mulPackageList: this.mulPackList
        };
    }
    save(filePath = "./data/depanalyze.json") {
        if (!this.isExecInit || !this.isExecLoad) {
            throw new Error("请先调用init和load方法");
        }
        const parentPath = path_1.default.resolve(filePath, "..");
        if (!fs_1.default.existsSync(parentPath)) {
            fs_1.default.mkdirSync(parentPath);
        }
        fs_1.default.writeFile(filePath, JSON.stringify(this.toObject()), function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("保存成功");
            }
        });
    }
}
exports.default = DepAnalyze;
// const depAnalyze = new DepAnalyze();
// depAnalyze.init();
// // "acorn", "8.10.0" 1
// // "glob", "10.3.3"
// // "express","4.18.2"
// depAnalyze.load("glob", "10.3.3");
// console.log(depAnalyze.getOrderedDepthGraph(2));
// depAnalyze.save();
// console.log("first");
