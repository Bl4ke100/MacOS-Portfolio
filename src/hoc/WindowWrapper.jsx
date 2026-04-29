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

        const randomPos = useRef({ x: 0, y: 0 });

        useGSAP(() => {
            const el = ref.current;
            if (!el) return;

            let startX = 0;
            let startY = window.innerHeight;

            if (triggerRect) {
                // The dock icon center
                startX = triggerRect.left + triggerRect.width / 2 - el.clientWidth / 2;
                startY = triggerRect.top + triggerRect.height / 2 - el.clientHeight / 2;
            }

            if (isOpen) {
                // Calculate random position when opening
                // Leave roughly 120px for the dock at the bottom
                const safeHeight = window.innerHeight - 120;

                const maxX = Math.max(0, window.innerWidth - (el.clientWidth || 800));
                const maxY = Math.max(0, safeHeight - (el.clientHeight || 600));

                randomPos.current = {
                    x: 20 + Math.random() * Math.max(0, maxX - 40),
                    y: 20 + Math.random() * Math.max(0, maxY - 40)
                };

                // The OPEN Animation
                gsap.fromTo(el, {
                    x: startX,
                    y: startY,
                    scale: 0.1,
                    opacity: 0,
                    transformOrigin: "center center"
                }, {
                    x: randomPos.current.x,
                    y: randomPos.current.y,
                    scale: 1,
                    opacity: 1,
                    duration: 0.55,
                    ease: "expo.out",
                });
            } else if (!isOpen && shouldRender) {
                // The CLOSE Animation
                gsap.to(el, {
                    x: startX,
                    y: startY,
                    scale: 0.05,
                    opacity: 0,
                    duration: 0.35,
                    ease: "expo.in",
                    onComplete: () => {
                        setShouldRender(false);
                    }
                });
            }
        }, [isOpen, shouldRender, triggerRect]);

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