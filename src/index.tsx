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
import {Provider} from 'react-redux';
import {allSagas} from './reducers/sagas';

const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger();
export const store: Store<StoreState> = createStore(rootReducer, applyMiddleware(loggerMiddleware, sagaMiddleware));
export const apiRoot = process.env.REACT_APP_BASE_URL;
sagaMiddleware.run(allSagas);
initInterceptors();
initAuth(store);

ReactDOM.render(
    (
        <Provider store={store}>
            <App/>
        </Provider>
    ),
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
