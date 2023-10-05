/// <reference types="node" />
import type { NextRouter, RouterEvent } from "next/router";
import { MittEmitter } from "./lib/mitt";
export type Url = string | UrlObject;
export type UrlObject = {
    pathname?: string;
    query?: NextRouter["query"];
    hash?: string;
};
export type UrlObjectComplete = {
    pathname: string;
    query: NextRouter["query"];
    hash: string;
    routeParams: NextRouter["query"];
};
interface TransitionOptions {
    shallow?: boolean;
    locale?: string | false;
    scroll?: boolean;
}
type InternalEventTypes = 
/** Allows custom parsing logic */
"NEXT_ROUTER_MOCK:parse"
/** Emitted when 'router.push' is called */
 | "NEXT_ROUTER_MOCK:push"
/** Emitted when 'router.replace' is called */
 | "NEXT_ROUTER_MOCK:replace";
/**
 * A base implementation of NextRouter that does nothing; all methods throw.
 */
export declare abstract class BaseRouter implements NextRouter {
    pathname: string;
    query: NextRouter["query"];
    asPath: string;
    /**
     * The `hash` property is NOT part of NextRouter.
     * It is only supplied as part of next-router-mock, for the sake of testing
     */
    hash: string;
    isReady: boolean;
    basePath: string;
    isFallback: boolean;
    isPreview: boolean;
    isLocaleDomain: boolean;
    locale: NextRouter["locale"];
    locales: NextRouter["locales"];
    defaultLocale?: NextRouter["defaultLocale"];
    domainLocales?: NextRouter["domainLocales"];
    events: MittEmitter<RouterEvent | InternalEventTypes>;
    abstract push(url: Url, as?: Url, options?: TransitionOptions): Promise<boolean>;
    abstract replace(url: Url): Promise<boolean>;
    back(): void;
    forward(): void;
    beforePopState(): void;
    prefetch(): Promise<void>;
    reload(): void;
    get route(): string;
}
export type MemoryRouterSnapshot = Readonly<MemoryRouter>;
/**
 * An implementation of NextRouter that does not change the URL, but just stores the current route in memory.
 */
export declare class MemoryRouter extends BaseRouter {
    static snapshot(original: MemoryRouter): MemoryRouterSnapshot;
    constructor(initialUrl?: Url, async?: boolean);
    /**
     * When enabled, there will be a short delay between calling `push` and when the router is updated.
     * This is used to simulate Next's async behavior.
     * However, for most tests, it is more convenient to leave this off.
     */
    async: boolean;
    /**
     * Store extra metadata, needed to support App Router (next/navigation)
     */
    internal: {
        query: import("querystring").ParsedUrlQuery;
        routeParams: import("querystring").ParsedUrlQuery;
        selectedLayoutSegment: string;
        selectedLayoutSegments: string[];
    };
    /**
     * Removes all event handlers, and sets the current URL back to default.
     * This will clear dynamic parsers, too.
     */
    reset(): void;
    useParser(parser: (urlObject: UrlObjectComplete) => void): () => void;
    push: (url: Url, as?: Url, options?: TransitionOptions) => Promise<boolean>;
    replace: (url: Url, as?: Url, options?: TransitionOptions) => Promise<boolean>;
    /**
     * Sets the current Memory route to the specified url, synchronously.
     */
    setCurrentUrl: (url: Url, as?: Url) => void;
    private _setCurrentUrl;
}
export {};
