import React from 'react';
import ReactDOM from 'react-dom/client';
import Routes from './components/Routes';
import './index.css';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import store from './redux/store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <Provider store = {store}>
          <ColorModeScript initialColorMode="dark" />
          <Routes />
        </Provider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
