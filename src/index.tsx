import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import createSagaMiddleware from 'redux-saga';
import {createLogger} from 'redux-logger';
import {applyMiddleware, createStore, Store} from 'redux';
import registerServiceWorker from './registerServiceWorker';
import {rootReducer, StoreState} from './reducers';

const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger();

export const store: Store<StoreState> = createStore(rootReducer, applyMiddleware(loggerMiddleware, sagaMiddleware));
export const apiRoot = process.env.REACT_APP_BASE_URL;

ReactDOM.render(
    <App/>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
