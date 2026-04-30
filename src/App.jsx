import React from 'react';
import useIsMobile from '#hooks/useIsMobile';
import MacDesktop from '#components/MacDesktop';
import IPhoneHome from '#components/IPhoneHome';

const App = () => {
  const isMobile = useIsMobile();
  return isMobile ? <IPhoneHome /> : <MacDesktop />;
};

export default App;