import WindowControls from '#components/WindowControls';
import WindowWrapper from '#hoc/WindowWrapper';
import { ChevronLeft, ChevronRight, Copy, PanelLeft, Plus, Search, Share, ShieldHalf } from 'lucide-react';
import React, { useState } from 'react';

const Safari = () => {
  // Use the secret Google iframe URL as the default homepage
  const defaultHome = "https://www.google.com/webhp?igu=1";
  const [url, setUrl] = useState("");
  const [iframeSrc, setIframeSrc] = useState(defaultHome);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const input = url.trim();
      if (!input) return;

      // Simple check: if it has no spaces and contains a dot, it's probably a website
      const isWebsite = input.includes('.') && !input.includes(' ');

      if (isWebsite) {
        let formattedUrl = input;
        if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
          formattedUrl = `https://${formattedUrl}`;
        }
        setIframeSrc(formattedUrl);
        setUrl(formattedUrl); // Update the bar to show the full URL
      } else {
        // It's a search phrase! Format it using the Google iframe hack
        const searchUrl = `https://www.google.com/search?igu=1&q=${encodeURIComponent(input)}`;
        setIframeSrc(searchUrl);
        // Leave their search text in the bar so it feels like a real browser
      }
    }
  };

  return (
    <div className="w-[895px] h-[600px] flex flex-col bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200">
      <div id="window-header" className="flex items-center px-4 py-2 bg-gray-100 border-b border-gray-200">
        <WindowControls target="safari" />
        <PanelLeft className="ml-10 icon cursor-pointer" />

        <div className='flex items-center gap-1 ml-5'>
          <ChevronLeft className='icon cursor-pointer' />
          <ChevronRight className='icon cursor-pointer' />
        </div>

        <div className='flex-1 flex items-center justify-center gap-3'>
          <ShieldHalf className="icon text-gray-500" />

          <div className='search flex items-center bg-white rounded-md px-3 py-1 w-2/3 border border-gray-300 shadow-sm'>
            <Search className='icon text-gray-400 mr-2' size={16} />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search Google or enter a URL"
              className='flex-1 bg-transparent outline-none text-sm text-center focus:text-left transition-all'
            />
          </div>
        </div>

        <div className='flex items-center gap-5'>
          <Share className='icon cursor-pointer' />
          <Plus className='icon cursor-pointer' onClick={() => { setIframeSrc(defaultHome); setUrl(""); }} />
          <Copy className='icon cursor-pointer' />
        </div>
      </div>

      <div className="flex-1 bg-white">
        <iframe
          src={iframeSrc}
          title="Safari Browser"
          className="w-full h-full border-none"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
}

const SafariWindow = WindowWrapper(Safari, 'safari');

export default SafariWindow;