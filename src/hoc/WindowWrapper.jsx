import { useRef, useState, useEffect } from 'react';
import useWindowStore from '#store/window.js';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

// Added registration
gsap.registerPlugin(Draggable);

const WindowWrapper = (Component, windowKey) => {
    const Wrapped = (props) => {
        const { focusWindow, windows } = useWindowStore();
        const { isOpen, zIndex, triggerRect } = windows[windowKey];
        const ref = useRef(null);

        const [shouldRender, setShouldRender] = useState(isOpen);

        useEffect(() => {
            if (isOpen) setShouldRender(true);
        }, [isOpen]);

        useGSAP(() => {
            const el = ref.current;
            if (!el) return;

            let targetX = 0;
            let targetY = 400;

            if (triggerRect) {
                const winRect = el.getBoundingClientRect();
                targetX = (triggerRect.left + triggerRect.width / 2) - (winRect.left + winRect.width / 2);
                targetY = (triggerRect.top + triggerRect.height / 2) - (winRect.top + winRect.height / 2);
            }

            if (isOpen) {
                // The OPEN Animation
                gsap.fromTo(el, {
                    x: targetX,
                    y: targetY,
                    scale: 0.5,
                    opacity: 0,
                    transformOrigin: "center center"
                }, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 0.55,
                    ease: "expo.out",
                });
            } else if (!isOpen && shouldRender) {
                // The CLOSE Animation
                gsap.to(el, {
                    x: targetX,
                    y: targetY,
                    scale: 0.05,
                    opacity: 0,
                    duration: 0.35,
                    ease: "expo.in",
                    onComplete: () => {
                        setShouldRender(false);
                    }
                });
            }
        }, [isOpen, shouldRender]);

        useGSAP(() => {
            const el = ref.current;
            if (!el) return;

            const dragInstance = Draggable.create(el, { onPress: () => focusWindow(windowKey) });

            return () => {
                if (dragInstance[0]) dragInstance[0].kill();
            };

        }, [shouldRender]);

        if (!shouldRender) return null;

        return (
            <section
                id={windowKey}
                ref={ref}
                style={{ zIndex }}
                className="absolute"
                onPointerDown={() => focusWindow(windowKey)}
            >
                <Component {...props} />
            </section>
        );
    };

    Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`;

    return Wrapped;
}

export default WindowWrapper;