import { WINDOW_CONFIG, INITIAL_Z_INDEX } from '#constants';
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer';

const useWindowStore = create(immer((set) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX + 1,

    openWindow: (windowKey, rect = null) => set((state) => {
        const win = state.windows[windowKey];
        win.isOpen = true;
        win.zIndex = state.nextZIndex;
        win.triggerRect = rect; 
        state.nextZIndex++;
    }),

    setWindowData: (windowKey, data) => set((state) => {
        state.windows[windowKey].data = JSON.parse(JSON.stringify(data));
    }),

    closeWindow: (windowKey) => set((state) => {
        const win = state.windows[windowKey];
        win.isOpen = false;
        win.zIndex = INITIAL_Z_INDEX;
        win.data = null;
    }),

    focusWindow: (windowKey) => set((state) => {
        const win = state.windows[windowKey];
        if (win.zIndex !== state.nextZIndex - 1) {
            win.zIndex = state.nextZIndex;
            state.nextZIndex++;
        }
    }),

})));

export default useWindowStore;