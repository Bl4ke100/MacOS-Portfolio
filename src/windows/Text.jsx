import React from 'react'
import WindowControls from '#components/WindowControls'
import WindowWrapper from '#hoc/WindowWrapper'
import useWindowStore from '#store/window'

const Text = () => {
    const { windows } = useWindowStore()
    const data = windows.txtfile.data

    if (!data) return null

    return (
        <>
            <div id="window-header">
                <WindowControls target="txtfile" />
                <p className="font-semibold text-sm ml-2">{data.name}</p>
            </div>

            <div className='bg-white h-full overflow-y-auto p-10'>
                <div className="max-w-2xl mx-auto flex flex-col gap-6 pb-10">
                    {data.image && (
                        <img src={data.image} alt={data.name} className="w-full rounded-lg object-cover" />
                    )}
                    
                    {data.subtitle && (
                        <h2 className="text-2xl font-bold text-gray-800">{data.subtitle}</h2>
                    )}
                    
                    {data.description && Array.isArray(data.description) && data.description.map((para, index) => (
                        <p key={index} className="text-gray-700 leading-relaxed text-base">
                            {para}
                        </p>
                    ))}
                </div>
            </div>
        </>
    )
}

const TextWindow = WindowWrapper(Text, 'txtfile');

export default TextWindow;
