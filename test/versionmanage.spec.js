"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const versionmanage_1 = require("../versionmanage");
const vitest_1 = require("vitest");
(0, vitest_1.describe)('analyseVersion', () => {
    (0, vitest_1.test)('should return a correct fullPackage', () => {
        // 模拟包名和版本数据
        const pkg1 = 'package1';
        const pkg2 = 'package2';
        const pkg3 = 'package3';
        const ver1 = '^1.1.2';
        const ver2 = '~1.3.2';
        const ver3 = '1.0.0';
        // 执行分析函数
        const fullPkg1 = (0, versionmanage_1.analyseVersion)(pkg1, ver1);
        const fullPkg2 = (0, versionmanage_1.analyseVersion)(pkg2, ver2);
        const fullPkg3 = (0, versionmanage_1.analyseVersion)(pkg3, ver3);
        // 测试结果
        (0, vitest_1.expect)(fullPkg1.packageName).toBe('package1');
        (0, vitest_1.expect)(fullPkg1.firstVer).toBe(1);
        (0, vitest_1.expect)(fullPkg1.secondVer).toBe(1);
        (0, vitest_1.expect)(fullPkg1.fixVer).toBe(2);
        (0, vitest_1.expect)(fullPkg1.reg).toBe("^");
        (0, vitest_1.expect)(fullPkg2.reg).toBe("~");
        (0, vitest_1.expect)(fullPkg3.reg).toBe("");
    });
});
(0, vitest_1.describe)('isEqualVersion', () => {
    (0, vitest_1.test)('should be equal version', () => {
        // 模拟版本数据
        const pkg = 'package';
        const ver1 = '^1.1.2';
        const ver2 = '^1.2.3';
        const ver3 = '~1.1.2';
        const ver4 = '~1.1.3';
        const ver5 = '1.1.2';
        const ver6 = '1.1.2';
        // 测试结果
        (0, vitest_1.expect)((0, versionmanage_1.isEqualVersion)(pkg, ver1, pkg, ver2)).toBe(true);
        (0, vitest_1.expect)((0, versionmanage_1.isEqualVersion)(pkg, ver3, pkg, ver4)).toBe(true);
        (0, vitest_1.expect)((0, versionmanage_1.isEqualVersion)(pkg, ver5, pkg, ver6)).toBe(true);
    });
    (0, vitest_1.test)('should be unequal version', () => {
        // 模拟版本数据
        const pkg = 'package';
        const ver1 = '^1.1.2';
        const ver2 = '^2.1.2';
        const ver3 = '~1.2.3';
        const ver4 = '~1.1.3';
        const ver5 = '1.1.3';
        const ver6 = '1.1.2';
        // 测试结果
        (0, vitest_1.expect)((0, versionmanage_1.isEqualVersion)(pkg, ver1, pkg, ver2)).toBe(false);
        (0, vitest_1.expect)((0, versionmanage_1.isEqualVersion)(pkg, ver3, pkg, ver4)).toBe(false);
        (0, vitest_1.expect)((0, versionmanage_1.isEqualVersion)(pkg, ver5, pkg, ver6)).toBe(false);
    });
});
