import { devtools, persist, subscribeWithSelector } from "zustand/middleware";

import { create } from "zustand";
import { createJobSlice } from "./job-slice";
import { immer } from "zustand/middleware/immer";

const createStoreSlice = (set: any, get: any, store: any) => ({
    ...createJobSlice(set, get, store),
});

const createPersistedStoreSlice = (set: any, get: any, store: any) => ({
    ...createJobSlice(set, get, store),
});

const logger =
    (config: any, { name }: { name?: string }) =>
    (set: any, get: any, api: any) =>
        config(
            (args: any) => {
                // console.log(`--- ${name} prev:`, get());
                set(args);
                console.log(`+++ ${name} next:`, get());
            },
            get,
            api,
        );

export const useStore = create<Store>()(
    devtools(
        logger(
            subscribeWithSelector(
                immer((...a) => ({
                    ...createStoreSlice(...a),
                })),
            ),
            { name: "store" },
        ),
        { name: "Zustand Devtools" },
    ),
);

export const usePersistedStore = create<Store>()(
    devtools(
        logger(
            persist(
                subscribeWithSelector(
                    immer((...a) => ({
                        ...createPersistedStoreSlice(...a),
                    })),
                ),
                {
                    name: "local-storage",
                },
            ),
            { name: "persisted-store" },
        ),
        { name: "Zustand Devtools" },
    ),
);

export type Store = ReturnType<typeof createStoreSlice>;
