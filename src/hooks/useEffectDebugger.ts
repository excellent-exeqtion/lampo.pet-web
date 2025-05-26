/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, useEffect } from "react";

const usePrevious = (value: any, initialValue: any) => {
    const ref = useRef(initialValue);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

export const useEffectDebugger = (processName: string, effectHook: any, dependencies: any, dependencyNames = []) => {
    const previousDeps = usePrevious(dependencies, []);

    const changedDeps = dependencies.reduce((accum: any, dependency: any, index: any) => {
        if (dependency !== previousDeps[index]) {
            const keyName = dependencyNames[index] || index;
            return {
                ...accum,
                [keyName]: {
                    before: previousDeps[index],
                    after: dependency
                }
            };
        }

        return accum;
    }, {});

    if (Object.keys(changedDeps).length) {
        console.log(`[use-effect-debugger] ${processName}:`, changedDeps);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effectHook, dependencies);
};

