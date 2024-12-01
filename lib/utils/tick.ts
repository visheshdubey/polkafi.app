/**
 * Executes a callback function on the next tick of the event loop.
 * This is a safer alternative to setTimeout(fn, 0).
 * 
 * @param callback - The function to execute on the next tick
 * @returns A promise that resolves when the callback has been executed
 */
export const tick = (callback: () => void): Promise<void> => {
    return new Promise((resolve) => {
        queueMicrotask(() => {
            callback();
            resolve();
        });
    });
};
