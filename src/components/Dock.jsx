import { dockApps } from '#constants';
import { useGSAP } from '@gsap/react';
import React, { useRef } from 'react'
import { Tooltip } from 'react-tooltip';
import gsap from 'gsap';
import useWindowStore from '#store/window.js';

const Dock = () => {
    const { openWindow, closeWindow, windows } = useWindowStore();
    const dockRef = useRef(null);

    useGSAP(() => {
        const dock = dockRef.current;
        if (!dock) return;

        const icons = dock.querySelectorAll(".dock-icon");

        const animateIcons = (mouseX) => {
            const { left } = dock.getBoundingClientRect();

            icons.forEach((icon) => {
                const { left: iconleft, width } = icon.getBoundingClientRect();
                const center = iconleft - left + width / 2;
                const distance = Math.abs(mouseX - center);
                const intensity = Math.exp(-(distance ** 2) / 2000);
                gsap.to(icon, {
                    scale: 1 + 0.25 * intensity,
                    y: -25 * intensity,
                    duration: 0.3,
                    ease: "power1.out"
                })
            });

        };

        const handleMouseMove = (e) => {
            const { left } = dock.getBoundingClientRect();

            animateIcons(e.clientX - left);
        };

        const resetIcons = () => {
            icons.forEach((icon) =>
                gsap.to(icon, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power1.out"
                })
            );
        }

        dock.addEventListener("mousemove", handleMouseMove);
        dock.addEventListener("mouseleave", resetIcons);

        return () => {
            dock.removeEventListener("mousemove", handleMouseMove);
            dock.removeEventListener("mouseleave", resetIcons);
        }


    }, []);


    const toggleApp = (app, rect) => {
        if (!app.canOpen) return;

        const window = windows[app.id];
        if (window.isOpen) {
            closeWindow(app.id);
        } else {
            openWindow(app.id, rect); // Pass it to the store
        }
    }

    return (
        <section id="dock">
            <div ref={dockRef} className="dock-container">
                {dockApps.map(({ id, name, icon, canOpen }) => (
                    <div key={id} className="relative flex justify-center"
                        data-tooltip-id={`dock-tooltip-${id}`}
                        data-tooltip-content={name}
                        data-tooltip-delay-show={150}
                    >
                        <button
                            type="button"
                            className='dock-icon'
                            aria-label={name}
                            disabled={!canOpen}
                            onClick={(e) => toggleApp({ id, canOpen }, e.currentTarget.getBoundingClientRect())}
                        >

                            <img
                                src={`/images/${icon}`}
                                alt={name}
                                loading="lazy"
                                className={canOpen ? "" : "opacity-60"} />

                        </button>
                        <Tooltip id={`dock-tooltip-${id}`} place="top" className="tooltip" offset={35} />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Dock