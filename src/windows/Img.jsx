import React from 'react'
import WindowControls from '#components/WindowControls'
import WindowWrapper from '#hoc/WindowWrapper'
import useWindowStore from '#store/window'

const Img = () => {
    const { windows } = useWindowStore()
    const data = windows.imgfile.data

    if (!data) return null

    return (
        <>
            <div id="window-header">
                <WindowControls target="imgfile" />
                <p className="ml-2">{data.name}</p>
            </div>

            <div className='preview'>
                {data.imageUrl && (
                    <img src={data.imageUrl} alt={data.name} />
                )}
            </div>
        </>
    )
}

const ImgWindow = WindowWrapper(Img, 'imgfile');

export default ImgWindow;
