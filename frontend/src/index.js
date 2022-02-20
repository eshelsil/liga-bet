import React from 'react';
// import {Provider} from 'react-redux';
import { render } from 'react-dom'; 
// import store from './_helpers/store';
// import SocketProvider, {NewSocketProvider} from './_helpers/socket';
import "core-js/stable";
import "regenerator-runtime/runtime";
import App from './App';
  
  render(
    // <Provider store={store}>
      // <NewSocketProvider>
          <App/>
      // </NewSocketProvider>
    // </Provider>
    ,
    document.getElementById('root')
  );
  