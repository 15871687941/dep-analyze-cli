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
const depanalyze_1 = __importDefault(require("../depanalyze"));
const vitest_1 = require("vitest");
const fs = __importStar(require("fs"));
const node_test_1 = require("node:test");
(0, vitest_1.describe)('DepAnalyze', () => {
    let depAnalyze = new depanalyze_1.default();
    const filePath = process.cwd() + '/test/depanalyze.json';
    (0, vitest_1.beforeEach)(() => {
        depAnalyze.init();
        depAnalyze.load('test', '1.0.0', 8);
        depAnalyze.save(filePath);
    });
    (0, node_test_1.afterEach)(() => {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.log('删除文件时出错：', err);
            }
            else {
                console.log('文件删除成功');
            }
        });
    });
    (0, vitest_1.test)('should return a correct depth', () => {
        (0, vitest_1.expect)(depAnalyze.getDepth()).toBe(5);
    });
    (0, vitest_1.test)('should return a correct isHasCircleDep', () => {
        (0, vitest_1.expect)(depAnalyze.hasCircleDep()).toBe(false);
    });
    (0, vitest_1.test)('should return a correct isHasMulPack', () => {
        (0, vitest_1.expect)(depAnalyze.hasMulPack()).toBe(false);
    });
    (0, vitest_1.test)('should return a correct DepList', () => {
        (0, vitest_1.expect)(depAnalyze.getDepList().length).toBeGreaterThan(0);
    });
    (0, vitest_1.test)('should return a object', () => {
        (0, vitest_1.expect)(depAnalyze.toObject()).toBeTypeOf('object');
        (0, vitest_1.expect)(depAnalyze.toSimpleObject()).toBeTypeOf('object');
    });
    (0, vitest_1.test)('should save a json correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, vitest_1.expect)(fs.existsSync(filePath)).toBe(true);
    }));
});
