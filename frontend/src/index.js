import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux'
import { applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise'
import ReduxThunk from 'redux-thunk'
import { createStore } from 'redux';
import Reducer from './_reducers'
import { composeWithDevTools } from 'redux-devtools-extension';

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware,ReduxThunk)(createStore) 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <React.StrictMode>
    <Provider store={createStoreWithMiddleware(Reducer, composeWithDevTools())}>
    <App />
    </Provider>
  </React.StrictMode>
);


reportWebVitals();
