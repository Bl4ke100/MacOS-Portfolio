import WindowControls from '#components/WindowControls.jsx';
import { techStack } from '#constants';
import WindowWrapper from '#hoc/WindowWrapper';
import { Check, Flag } from 'lucide-react';
import React from 'react'

const Terminal = () => {
    return (
        <>
            <div id="window-header">
                <WindowControls target="terminal"/>
                <h2>Tech Stack</h2>
            </div>

            <div className="techstack">
                <p>
                    <span className="font-bold">@Blake % </span>
                    show tech stack
                </p>

                <div className="label">
                    <p className="w-32">Category</p>
                    <p>Technologies</p>
                </div>

                <ul className='content'>
                    {techStack.map(({ category, items }) => (
                        <li className='flex item-center' key={category}>
                            <Check size={20} className='check' />
                            <h3>{category}</h3>
                            <ul>
                                {items.map((item, i) => (
                                    <li key={i}>
                                        {item}{i < items.length - 1 ? "," : ""}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>

                <div className='footnote'>
                    <p>
                        <Check size={20} className='check' />8 of 8 loaded successfully
                    </p>
                    <p className='text-black'>
                        <Flag size={15} fill='black' />
                        Render time : 6ms
                    </p>
                </div>

            </div>
        </>
    );
};

const TerminalWindow = WindowWrapper(Terminal, 'terminal');

export default TerminalWindow;