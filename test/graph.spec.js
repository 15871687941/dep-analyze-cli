"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const graph_1 = __importDefault(require("../graph"));
(0, vitest_1.test)('GraphByAdjacencyList', () => {
    const graph = new graph_1.default();
    (0, vitest_1.test)('addNode', () => {
        (0, vitest_1.expect)(graph.addNode('A')).toBe(true);
        (0, vitest_1.expect)(graph.addNode('B')).toBe(true);
        (0, vitest_1.expect)(graph.addNode('A')).toBe(false); // Adding duplicate node should return false
    });
    (0, vitest_1.test)('addEdge', () => {
        graph.addNode('A');
        graph.addNode('B');
        graph.addNode('C');
        (0, vitest_1.expect)(graph.addEdge('A', 'B')).toBe(true);
        (0, vitest_1.expect)(graph.addEdge('A', 'C')).toBe(true);
        (0, vitest_1.expect)(graph.addEdge('A', 'B')).toBe(false); // Adding duplicate edge should return false
        (0, vitest_1.expect)(graph.addEdge('B', 'C')).toBe(false); // Adding edge between non-existing nodes should return false
    });
    (0, vitest_1.test)('getNeighbors', () => {
        graph.addNode('A');
        graph.addNode('B');
        graph.addNode('C');
        graph.addEdge('A', 'B');
        graph.addEdge('A', 'C');
        (0, vitest_1.expect)(graph.getNeighbors('A')).toBe(['B', 'C']);
        (0, vitest_1.expect)(graph.getNeighbors('B')).toBe([]);
        (0, vitest_1.expect)(graph.getNeighbors('C')).toBe([]);
        (0, vitest_1.expect)(graph.getNeighbors('D')).toBe(undefined); // Getting neighbors of non-existing node should return undefined
    });
    // Add more tests for other methods
});
