import {createContext, useState} from 'react';

export const AppProvider = props => {
  const [isActionDone, setIsActionDone] = useState(false);

  return (
    <AppContext.Provider value={{isActionDone, setIsActionDone}}>
      {props.children}
    </AppContext.Provider>
  );
};

export const AppContext = createContext();
