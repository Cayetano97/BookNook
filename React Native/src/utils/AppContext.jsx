import React, {createContext, useState} from 'react';

const AppContext = createContext({
  isActionDone: false,
  setIsActionDone: () => {},
});

export const AppProvider = ({children}) => {
  const [isActionDone, setIsActionDone] = useState(false);

  return (
    <AppContext.Provider value={{isActionDone, setIsActionDone}}>
      {children}
    </AppContext.Provider>
  );
};

export {AppContext};
