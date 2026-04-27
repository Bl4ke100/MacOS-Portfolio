import { WINDOW_CONFIG } from '#constants';
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer';

const INITIAL_Z_INDEX = 10;

const useWindowStore = create(immer((set) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX + 1,

    openWindow: (windowKey, data = null) => set((state) => {
        const win = state.windows[windowKey];
        win.isOpen = true;
        win.zIndex = state.nextZIndex;
        win.data = data ?? win.data;
        state.nextZIndex++;
    }),

    closeWindow: (windowKey) => set((state) => {
        const win = state.windows[windowKey];
        win.isOpen = false;
        win.zIndex = INITIAL_Z_INDEX;
        win.data = null;
    }),

    focusWindow: (windowKey) => set((state) => {
        const win = state.windows[windowKey];
        // Only increment if it's not already the top window
        if (win.zIndex !== state.nextZIndex - 1) {
            win.zIndex = state.nextZIndex;
            state.nextZIndex++;
        }
    }),

})));

export default useWindowStore;