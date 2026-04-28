import WindowControls from '#components/WindowControls'
import { gallery, photosLinks } from '#constants'
import WindowWrapper from '#hoc/WindowWrapper'
import { Mail, Search } from 'lucide-react'
import React from 'react'
import useWindowStore from '#store/window'

const Photos = () => {
    const { openWindow } = useWindowStore();

    return (
        <>
            <div id='window-header'>
                <WindowControls target="photos" />

                <div className='w-full flex justify-end items-center gap-3 text-gray-500'>
                    <Mail className='icon' />
                    <Search className='icon' />
                </div>
            </div>

            <div className='flex w-full'>
                <div className='sidebar'>
                    <h2>Photos</h2>

                    <ul>
                        {photosLinks.map(({ id, icon, title }) => (
                            <li key={id} >
                                <img src={icon} alt={title} />
                                <p>{title}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className='gallery'>
                    <ul>
                        {gallery.map(({ id, img }) => (
                            <li key={id}
                                onClick={() => {
                                    // 1. Set the data in the store FIRST, just like Finder does
                                    useWindowStore.getState().setWindowData("imgfile", {
                                        id,
                                        name: "Gallery image",
                                        icon: "/images/image.png",
                                        kind: "file",
                                        fileType: "img",
                                        imageUrl: img
                                    });
                                    // 2. THEN open the window
                                    openWindow("imgfile");
                                }}
                            >
                                <img src={img} alt={`Gallery image ${id}`} />
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </>
    )
}

const PhotosWindow = WindowWrapper(Photos, "photos");

export default PhotosWindow