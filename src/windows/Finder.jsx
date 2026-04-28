import WindowControls from '#components/WindowControls'
import { locations } from '#constants';
import WindowWrapper from '#hoc/WindowWrapper';
import useLocationStore from '#store/location';
import { Search } from 'lucide-react'
import React from 'react'
import useWindowStore from '#store/window';

const Finder = () => {
    const { openWindow } = useWindowStore();
    const { activeLocation, setActiveLocation } = useLocationStore();

    const openItem = (item) => {
        if (item.fileType === "pdf") return openWindow("resume");
        if (item.fileType === "txt") {
            useWindowStore.getState().setWindowData("txtfile", item);
            return openWindow("txtfile");
        }
        if (item.fileType === "img") {
            useWindowStore.getState().setWindowData("imgfile", item);
            return openWindow("imgfile");
        }
        if (item.kind === "folder") return setActiveLocation(item);
        if (['fig', 'url'].includes(item.fileType) && item.href)
            return window.open(item.href, "_blank");
    };

    const renderList = (items) => items.map((item) => (
        <li
            key={item.id}
            onClick={() => setActiveLocation(item)}
            className={item.id === activeLocation?.id ? "active" : "not-active"}
        >
            <img src={item.icon} alt={item.name} className='w-4' />
            <p className='text-sm font-medium truncate'>{item.name}</p>
        </li>
    ))

    return (
        <>
            <div id="window-header">
                <WindowControls target="finder" />
                <Search className="icon" />
            </div>

            <div className='bg-white flex h-full'>
                <div className='sidebar'>
                    <div>
                        <h3>Favorites</h3>
                        <ul>
                            <ul>
                                {renderList(Object.values(locations))}
                            </ul>
                        </ul>
                    </div>

                    <div>
                        <h3>My Projects</h3>
                        <ul>
                            <ul>
                                {renderList(locations.work.children)}
                            </ul>
                        </ul>
                    </div>
                </div>
                <ul className='content'>
                    {activeLocation.children?.map((item) => (
                        <li key={item.id} className={item.position} onClick={() => openItem(item)}>
                            <img src={item.icon} alt={item.name} />
                            <p>{item.name}</p>
                        </li>
                    ))}
                </ul>
            </div>

        </>
    );
};

const FinderWindow = WindowWrapper(Finder, "finder");

export default FinderWindow;