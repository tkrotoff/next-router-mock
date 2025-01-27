"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRouter = exports.useRouter = exports.memoryRouter = exports.BaseRouter = exports.MemoryRouter = exports.useMemoryRouter = void 0;
const react_1 = __importDefault(require("react"));
const MemoryRouter_1 = require("./MemoryRouter");
const useMemoryRouter_1 = require("./useMemoryRouter");
const withMemoryRouter_1 = require("./withMemoryRouter");
const MemoryRouterContext_1 = require("./MemoryRouterContext");
// Export extra mock APIs:
var useMemoryRouter_2 = require("./useMemoryRouter");
Object.defineProperty(exports, "useMemoryRouter", { enumerable: true, get: function () { return useMemoryRouter_2.useMemoryRouter; } });
var MemoryRouter_2 = require("./MemoryRouter");
Object.defineProperty(exports, "MemoryRouter", { enumerable: true, get: function () { return MemoryRouter_2.MemoryRouter; } });
Object.defineProperty(exports, "BaseRouter", { enumerable: true, get: function () { return MemoryRouter_2.BaseRouter; } });
// Export the singleton:
exports.memoryRouter = new MemoryRouter_1.MemoryRouter();
exports.memoryRouter.async = false;
exports.default = exports.memoryRouter;
// Export the `useRouter` hook:
const useRouter = () => {
    return (react_1.default.useContext(MemoryRouterContext_1.MemoryRouterContext) || // Allow <MemoryRouterProvider> to override the singleton, if needed
        (0, useMemoryRouter_1.useMemoryRouter)(exports.memoryRouter));
};
exports.useRouter = useRouter;
// Export the `withRouter` HOC:
const withRouter = (ComposedComponent) => {
    return (0, withMemoryRouter_1.withMemoryRouter)(exports.useRouter, ComposedComponent);
};
exports.withRouter = withRouter;
//# sourceMappingURL=index.js.map