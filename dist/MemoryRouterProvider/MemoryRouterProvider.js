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
exports.factory = void 0;
const react_1 = __importStar(require("react"));
const index_1 = __importStar(require("../index"));
const MemoryRouterContext_1 = require("../MemoryRouterContext");
function factory(dependencies) {
    const { RouterContext } = dependencies;
    const MemoryRouterProvider = ({ children, url, async, ...eventHandlers }) => {
        const memoryRouter = (0, react_1.useMemo)(() => {
            if (typeof url !== "undefined") {
                // If the `url` was specified, we'll use an "isolated router" instead of the singleton.
                return new index_1.MemoryRouter(url, async);
            }
            // Normally we'll just use the singleton:
            return index_1.default;
        }, [url, async]);
        const routerSnapshot = (0, index_1.useMemoryRouter)(memoryRouter, eventHandlers);
        return (react_1.default.createElement(MemoryRouterContext_1.MemoryRouterContext.Provider, { value: routerSnapshot },
            react_1.default.createElement(RouterContext.Provider, { value: routerSnapshot }, children)));
    };
    return MemoryRouterProvider;
}
exports.factory = factory;
//# sourceMappingURL=MemoryRouterProvider.js.map