"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GraphByAdjacencyList {
    constructor() {
        this.nodes = new Map();
    }
    addNode(node) {
        if (!this.hasNode(node)) {
            this.nodes.set(node, []);
            return true;
        }
        return false;
    }
    addEdge(node1, node2) {
        if (this.hasNode(node1) && this.hasNode(node2)) {
            const neighbors = this.getNeighbors(node1);
            if (!neighbors.includes(node2)) {
                neighbors.push(node2);
                return true;
            }
        }
        return false;
    }
    hasNode(node) {
        return this.nodes.has(node);
    }
    getNeighbors(node) {
        if (this.hasNode(node)) {
            return this.nodes.get(node);
        }
        return undefined;
    }
    getNodes() {
        let ns = [];
        for (let n of Array.from(this.nodes.keys())) {
            ns.push(n);
        }
        return ns;
    }
    getFirstNeighbor(node) {
        var _a;
        if (this.hasNode(node)) {
            return (_a = this.nodes.get(node)) === null || _a === void 0 ? void 0 : _a.at(0);
        }
        return undefined;
    }
    getNextNeighbor(node1, node2) {
        var _a, _b;
        if (this.hasNode(node1)) {
            const index = (_a = this.nodes.get(node1)) === null || _a === void 0 ? void 0 : _a.indexOf(node2);
            if (index === -1) {
                return undefined;
            }
            return (_b = this.nodes.get(node1)) === null || _b === void 0 ? void 0 : _b.at(index + 1);
        }
        return undefined;
    }
    toObject() {
        return Object.fromEntries(this.nodes);
    }
}
exports.default = GraphByAdjacencyList;
