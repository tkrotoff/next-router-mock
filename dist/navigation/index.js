"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSelectedLayoutSegments = exports.useSelectedLayoutSegment = exports.useParams = exports.usePathname = exports.useSearchParams = exports.useRouter = void 0;
const react_1 = require("react");
const index_1 = __importDefault(require("../index"));
function useSnapshot(makeSnapshot) {
    const [snapshot, setSnapshot] = (0, react_1.useState)(() => makeSnapshot(index_1.default, null));
    (0, react_1.useEffect)(() => {
        // To ensure we don't call setRouter after unmounting:
        let isMounted = true;
        const handleRouteChange = () => {
            if (!isMounted)
                return;
            // Ensure the reference changes each render:
            setSnapshot((prev) => makeSnapshot(index_1.default, prev));
        };
        index_1.default.events.on("routeChangeComplete", handleRouteChange);
        index_1.default.events.on("hashChangeComplete", handleRouteChange);
        return () => {
            isMounted = false;
            index_1.default.events.off("routeChangeComplete", handleRouteChange);
            index_1.default.events.off("hashChangeComplete", handleRouteChange);
        };
    }, []);
    return snapshot;
}
const useRouter = () => {
    // All these methods are static, and never trigger a rerender:
    return (0, react_1.useMemo)(() => ({
        push: (url, options) => index_1.default.push(url),
        replace: (url, options) => index_1.default.replace(url),
        refresh: index_1.default.reload,
        prefetch: index_1.default.prefetch,
        back: index_1.default.back,
        forward: index_1.default.forward,
    }), []);
};
exports.useRouter = useRouter;
const useSearchParams = () => {
    return useSnapshot((r, prev) => {
        const query = r.internal.query;
        debugger;
        // Build the search params from the query object:
        const newSearchParams = new URLSearchParams();
        Object.keys(query).forEach((key) => {
            const value = query[key];
            if (Array.isArray(value)) {
                value.forEach((val) => newSearchParams.append(key, val));
            }
            else if (value !== undefined) {
                newSearchParams.append(key, value);
            }
        });
        // Prevent rerendering if the query is the same:
        if (prev && newSearchParams.toString() === prev.toString()) {
            return prev;
        }
        return newSearchParams;
    });
};
exports.useSearchParams = useSearchParams;
const usePathname = () => {
    return useSnapshot((r) => r.pathname);
};
exports.usePathname = usePathname;
const useParams = () => {
    return useSnapshot((r) => r.internal.routeParams);
};
exports.useParams = useParams;
const useSelectedLayoutSegment = () => useSnapshot((r) => r.internal.selectedLayoutSegment);
exports.useSelectedLayoutSegment = useSelectedLayoutSegment;
const useSelectedLayoutSegments = () => useSnapshot((r) => r.internal.selectedLayoutSegments);
exports.useSelectedLayoutSegments = useSelectedLayoutSegments;
//# sourceMappingURL=index.js.map