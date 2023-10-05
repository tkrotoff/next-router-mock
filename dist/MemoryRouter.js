"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryRouter = exports.BaseRouter = void 0;
const mitt_1 = __importDefault(require("./lib/mitt"));
const urls_1 = require("./urls");
/**
 * A base implementation of NextRouter that does nothing; all methods throw.
 */
class BaseRouter {
    constructor() {
        this.pathname = "/";
        this.query = {};
        this.asPath = "/";
        /**
         * The `hash` property is NOT part of NextRouter.
         * It is only supplied as part of next-router-mock, for the sake of testing
         */
        this.hash = "";
        // These are constant:
        this.isReady = true;
        this.basePath = "";
        this.isFallback = false;
        this.isPreview = false;
        this.isLocaleDomain = false;
        this.locale = undefined;
        this.locales = [];
        this.events = (0, mitt_1.default)();
    }
    back() {
        // Not implemented
    }
    forward() {
        // Not implemented
    }
    beforePopState() {
        // Do nothing
    }
    async prefetch() {
        // Do nothing
    }
    reload() {
        // Do nothing
    }
    // Keep route and pathname values in sync
    get route() {
        return this.pathname;
    }
}
exports.BaseRouter = BaseRouter;
/**
 * An implementation of NextRouter that does not change the URL, but just stores the current route in memory.
 */
class MemoryRouter extends BaseRouter {
    static snapshot(original) {
        return Object.assign(new MemoryRouter(), original);
    }
    constructor(initialUrl, async) {
        super();
        /**
         * When enabled, there will be a short delay between calling `push` and when the router is updated.
         * This is used to simulate Next's async behavior.
         * However, for most tests, it is more convenient to leave this off.
         */
        this.async = false;
        /**
         * Store extra metadata, needed to support App Router (next/navigation)
         */
        this.internal = {
            query: {},
            routeParams: {},
            selectedLayoutSegment: "[next-router-mock] Not Yet Implemented",
            selectedLayoutSegments: ["[next-router-mock] Not Yet Implemented"],
        };
        this.push = (url, as, options) => {
            return this._setCurrentUrl(url, as, options, "push");
        };
        this.replace = (url, as, options) => {
            return this._setCurrentUrl(url, as, options, "replace");
        };
        /**
         * Sets the current Memory route to the specified url, synchronously.
         */
        this.setCurrentUrl = (url, as) => {
            // (ignore the returned promise)
            void this._setCurrentUrl(url, as, undefined, "set", false);
        };
        if (initialUrl)
            this.setCurrentUrl(initialUrl);
        if (async)
            this.async = async;
    }
    /**
     * Removes all event handlers, and sets the current URL back to default.
     * This will clear dynamic parsers, too.
     */
    reset() {
        this.events = (0, mitt_1.default)();
        this.setCurrentUrl("/");
    }
    useParser(parser) {
        this.events.on("NEXT_ROUTER_MOCK:parse", parser);
        return () => this.events.off("NEXT_ROUTER_MOCK:parse", parser);
    }
    async _setCurrentUrl(url, as, options, source, async = this.async) {
        // Parse the URL if needed:
        const newRoute = parseUrlToCompleteUrl(url, this.pathname);
        // Optionally apply dynamic routes (can mutate routes)
        this.events.emit("NEXT_ROUTER_MOCK:parse", newRoute);
        let asPath;
        if (as === undefined || as === null) {
            asPath = getRouteAsPath(newRoute);
        }
        else {
            const asRoute = parseUrlToCompleteUrl(as, this.pathname);
            this.events.emit("NEXT_ROUTER_MOCK:parse", asRoute);
            asPath = getRouteAsPath(asRoute);
            // "as" hash and route params always take precedence:
            newRoute.hash = asRoute.hash;
            newRoute.routeParams = asRoute.routeParams;
        }
        const shallow = (options === null || options === void 0 ? void 0 : options.shallow) || false;
        // Fire "start" event:
        const triggerHashChange = shouldTriggerHashChange(this, newRoute);
        if (triggerHashChange) {
            this.events.emit("hashChangeStart", asPath, { shallow });
        }
        else {
            this.events.emit("routeChangeStart", asPath, { shallow });
        }
        // Simulate the async nature of this method
        if (async)
            await new Promise((resolve) => setTimeout(resolve, 0));
        // Update this instance:
        this.asPath = asPath;
        this.pathname = newRoute.pathname;
        this.query = { ...newRoute.query, ...newRoute.routeParams };
        this.hash = newRoute.hash;
        this.internal.query = newRoute.query;
        this.internal.routeParams = newRoute.routeParams;
        if (options === null || options === void 0 ? void 0 : options.locale) {
            this.locale = options.locale;
        }
        // Fire "complete" event:
        if (triggerHashChange) {
            this.events.emit("hashChangeComplete", this.asPath, { shallow });
        }
        else {
            this.events.emit("routeChangeComplete", this.asPath, { shallow });
        }
        // Fire internal events:
        const eventName = source === "push" ? "NEXT_ROUTER_MOCK:push" : source === "replace" ? "NEXT_ROUTER_MOCK:replace" : undefined;
        if (eventName)
            this.events.emit(eventName, this.asPath, { shallow });
        return true;
    }
}
exports.MemoryRouter = MemoryRouter;
/**
 * Normalizes the url or urlObject into a UrlObjectComplete.
 */
function parseUrlToCompleteUrl(url, currentPathname) {
    var _a;
    const parsedUrl = typeof url === "object" ? url : (0, urls_1.parseUrl)(url);
    return {
        pathname: normalizeTrailingSlash((_a = parsedUrl.pathname) !== null && _a !== void 0 ? _a : currentPathname),
        query: parsedUrl.query || {},
        hash: parsedUrl.hash || "",
        routeParams: {},
    };
}
/**
 * Creates a URL from a pathname + query.
 * Injects query params into the URL slugs, the same way that next/router does.
 */
function getRouteAsPath({ pathname, query, hash, routeParams }) {
    const remainingQuery = { ...query };
    // Replace slugs, and remove them from the `query`
    let asPath = pathname.replace(/\[{1,2}(.+?)]{1,2}/g, ($0, slug) => {
        if (slug.startsWith("..."))
            slug = slug.replace("...", "");
        let value = routeParams[slug];
        if (!value) {
            // Pop the slug value from the query:
            value = remainingQuery[slug];
            delete remainingQuery[slug];
        }
        if (Array.isArray(value)) {
            return value.map((v) => encodeURIComponent(v)).join("/");
        }
        return value !== undefined ? encodeURIComponent(String(value)) : "";
    });
    // Remove any trailing slashes; this can occur if there is no match for a catch-all slug ([[...slug]])
    asPath = normalizeTrailingSlash(asPath);
    // Append remaining query as a querystring, if needed:
    const qs = (0, urls_1.stringifyQueryString)(remainingQuery);
    if (qs)
        asPath += `?${qs}`;
    if (hash)
        asPath += hash;
    return asPath;
}
function normalizeTrailingSlash(path) {
    return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path || "/";
}
function shouldTriggerHashChange(current, newRoute) {
    const isHashChange = current.hash !== newRoute.hash;
    const isQueryChange = (0, urls_1.stringifyQueryString)(current.query) !== (0, urls_1.stringifyQueryString)(newRoute.query);
    const isRouteChange = isQueryChange || current.pathname !== newRoute.pathname;
    /**
     * Try to replicate NextJs routing behaviour:
     *
     * /foo       -> routeChange
     * /foo#baz   -> hashChange
     * /foo#baz   -> hashChange
     * /foo       -> hashChange
     * /foo       -> routeChange
     * /bar#fuz   -> routeChange
     */
    return !isRouteChange && (isHashChange || newRoute.hash);
}
//# sourceMappingURL=MemoryRouter.js.map