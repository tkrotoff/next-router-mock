import type { UrlObjectComplete } from "../MemoryRouter";
type AbstractedNextDependencies = Pick<typeof import("next/dist/shared/lib/router/utils") & typeof import("next/dist/shared/lib/page-path/normalize-page-path") & typeof import("next/dist/shared/lib/router/utils/route-matcher") & typeof import("next/dist/shared/lib/router/utils/route-regex"), "getSortedRoutes" | "getRouteMatcher" | "getRouteRegex" | "isDynamicRoute" | "normalizePagePath">;
/**
 * The only differences between Next 10/11/12/13 is the import paths,
 * so this "factory" function allows us to abstract these dependencies.
 */
export declare function factory(dependencies: AbstractedNextDependencies): (paths: string[]) => (url: UrlObjectComplete) => void;
export {};
