import { locations } from '#constants'
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import { Draggable } from 'gsap/Draggable';
import React from 'react'
import gsap from 'gsap';
import useWindowStore from '#store/window';
import useLocationStore from '#store/location';



const Home = () => {

    const { setActiveLocation } = useLocationStore();
    const { openWindow } = useWindowStore();

    const handleOpenProjectFInder = (project) => {
        setActiveLocation(project)
        openWindow("finder")
    }

    const projects = locations.work?.children ?? [];

    useGSAP(() => {
        Draggable.create(".folder");
    }, []);

    return (
        <section id='home'>
            <ul>
                {projects.map((project) => (
                    <li key={project.id} className='group folder' id={project.id}>
                        <img src="/images/folder.png" alt={project.name} onClick={() => handleOpenProjectFInder(project)} />
                        <p>{project.name}</p>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default Home