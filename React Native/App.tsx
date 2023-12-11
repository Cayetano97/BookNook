import React from 'react';
import Header from "./src/components/Header/Header";
import MainWindow from './src/components/MainWindow/MainWindow';
import { AppProvider } from './src/utils/AppContext';


function App(): JSX.Element {
  return (
    <AppProvider>
    <Header />
    <MainWindow />
    </AppProvider>
  );
}

export default App;
