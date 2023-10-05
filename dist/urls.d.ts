import type { NextRouter } from "next/router";
import type { UrlObject } from "./MemoryRouter";
export declare function parseUrl(url: string): UrlObject;
export declare function stringifyQueryString(query: NextRouter["query"]): string;
