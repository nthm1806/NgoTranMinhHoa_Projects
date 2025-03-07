import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CustomerProvider } from './Context'
import { Provider } from 'react-redux';
import store from './redux/store.js';

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  // <React.StrictMode>
  <Provider store={store}>
     <CustomerProvider>
    <App />
  </CustomerProvider>
  </Provider>
  // {/* </React.StrictMode> */}
);

reportWebVitals();
