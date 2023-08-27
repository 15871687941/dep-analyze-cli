"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const vitest_1 = require("vitest");
(0, vitest_1.describe)('readModuleDependencies', () => {
    (0, vitest_1.test)('should read module dependencies correctly', () => {
        // 模拟需要测试的目录结构和package.json文件
        const baseDir = process.cwd() + '/test';
        const isLocal = true;
        console.log(baseDir);
        (0, utils_1.readModuleDependencies)(baseDir, isLocal);
        (0, vitest_1.expect)(utils_1.localDependencies.size).toBe(10);
        (0, vitest_1.expect)(utils_1.globalDependencies.size).toBe(0);
    });
});
(0, vitest_1.describe)('getLocalDepConfObj', () => {
    (0, vitest_1.test)('should return local dependency configuration object', () => {
        // 模拟需要测试的场景
        const packageName = 'package-name';
        const version = '1.0.0';
        const isLocal = true;
        // 创建测试用的localDependencies
        utils_1.localDependencies.set('package-name&1.0.0', {
            name: 'package-name',
            version: '1.0.0',
            dependencies: {}
        });
        // 调用getLocalDepConfObj函数
        const result = (0, utils_1.getLocalDepConfObj)(packageName, version, isLocal);
        // 验证返回的DepConfObj是否符合预期
        (0, vitest_1.expect)(result).toEqual({
            name: 'package-name',
            version: '1.0.0',
            dependencies: {}
        });
        // 清理测试用的localDependencies
        utils_1.localDependencies.clear();
    });
});
(0, vitest_1.describe)('getGlobalDepConfObj', () => {
    (0, vitest_1.test)('should return global dependency configuration object', () => {
        // 模拟需要测试的场景
        const packageName = 'package-name';
        const version = '1.0.0';
        const isLocal = false;
        // 创建测试用的globalDependencies
        utils_1.globalDependencies.set('package-name&1.0.0', {
            name: 'package-name',
            version: '1.0.0',
            dependencies: {}
        });
        // 调用getGlobalDepConfObj函数
        const result = (0, utils_1.getGlobalDepConfObj)(packageName, version, isLocal);
        // 验证返回的DepConfObj是否符合预期
        (0, vitest_1.expect)(result).toEqual({
            name: 'package-name',
            version: '1.0.0',
            dependencies: {}
        });
        // 清理测试用的globalDependencies
        utils_1.globalDependencies.clear();
    });
});
(0, vitest_1.describe)('getDepPkgVerList', () => {
    (0, vitest_1.test)('should return dependency package version list', () => {
        // 模拟需要测试的场景
        const isLocal = true;
        // 创建测试用的localDependencies
        utils_1.localDependencies.set('package1&1.0.0', {
            name: 'package1',
            version: '1.0.0',
            dependencies: {}
        });
        utils_1.localDependencies.set('package2&2.0.0', {
            name: 'package2',
            version: '2.0.0',
            dependencies: {}
        });
        // 调用getDepPkgVerList函数
        const result = (0, utils_1.getDepPkgVerList)(isLocal);
        // 验证返回的DepPkgVerList是否符合预期
        (0, vitest_1.expect)(result).toEqual([
            { packageName: 'package1', version: '1.0.0' },
            { packageName: 'package2', version: '2.0.0' }
        ]);
        // 清理测试用的localDependencies
        utils_1.localDependencies.clear();
    });
});
