import React, { ReactNode } from "react";
import { Url } from "../index";
import { MemoryRouterEventHandlers } from "../useMemoryRouter";
type AbstractedNextDependencies = Pick<typeof import("next/dist/shared/lib/router-context"), "RouterContext">;
export type MemoryRouterProviderProps = {
    /**
     * The initial URL to render.
     */
    url?: Url;
    async?: boolean;
    children?: ReactNode;
} & MemoryRouterEventHandlers;
export declare function factory(dependencies: AbstractedNextDependencies): React.FC<MemoryRouterProviderProps>;
export {};
