import React, { useRef } from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const FONT_WEIGHTS = {
    subtitle: { min: 100, max: 900, default: 400 },
    title: { min: 100, max: 900, default: 400 }
};

const renderText = (text, className, baseWeight = 400) => {
    return [...text].map((char, i) => (
        <span key={i} className={className} style={{
            fontWeight: baseWeight,
            display: 'inline-block'
        }}>
            {char === ' ' ? '\u00A0' : char}
        </span>
    ))
};

const setupTextHover = (container, type) => {
    if (!container) return;

    const letters = container.querySelectorAll('span');
    const { min, max, default: base } = FONT_WEIGHTS[type];

    const animateLetter = (letter, weight, duration = 0.25) => {
        return gsap.to(letter, {
            duration,
            ease: "power2.out",
            fontWeight: weight
        })
    }

    const handleMouseMove = (e) => {
        letters.forEach((letter) => {
            const { left, width } = letter.getBoundingClientRect();
            const distance = Math.abs(e.clientX - (left + width / 2));
            const intensity = Math.exp(-(distance ** 1.5) / 2000);

            const targetWeight = Math.round(base + (max - base) * intensity);
            animateLetter(letter, targetWeight);
        })
    }

    const handleMouseLeave = () => {
        letters.forEach((letter) => animateLetter(letter, base, 0.5));
    }

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
    };
};

function Welcome() {

    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    useGSAP(() => {
        const cleanupTitle = setupTextHover(titleRef.current, 'title');
        const cleanupSubtitle = setupTextHover(subtitleRef.current, 'subtitle');

        return () => {
            if (cleanupTitle) cleanupTitle();
            if (cleanupSubtitle) cleanupSubtitle();
        }
    }, []);

    return (
        <section id="welcome">
            <p ref={subtitleRef} className="cursor-default mb-5">
                {renderText(
                    'Hi, I\'m Blake! Welcome to my',
                    "text-3xl font-georama",
                    200
                )}
            </p>
            <h1 ref={titleRef} className="cursor-default">
                {renderText(
                    'Portfolio',
                    "text-9xl italic font-georama",
                )}
            </h1>

            <div className="small-screen">
                <p>This portfolio is designed for desktop/tablet screens</p>
            </div>
        </section>
    )
}

export default Welcome