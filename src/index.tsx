import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import createSagaMiddleware from 'redux-saga';
import {createLogger} from 'redux-logger';
import {applyMiddleware, createStore, Store} from 'redux';
import registerServiceWorker from './registerServiceWorker';
import {rootReducer, StoreState} from './reducers';
import {initInterceptors} from './initInterceptors';
import {initAuth} from './reducers/auth/auth0/Auth0Handler';

const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger();
export const store: Store<StoreState> = createStore(rootReducer, applyMiddleware(loggerMiddleware, sagaMiddleware));
initAuth(store);
initInterceptors();

export const apiRoot = process.env.REACT_APP_BASE_URL;

ReactDOM.render(
    <App/>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
