import {store} from './index';
import axios from 'axios';
import {auth0Handler} from './reducers/auth/auth0/Auth0Handler';

interface ApiError {
    timestamp: string
    message: string
    debug?: any
}

export function initInterceptors() {
    axios.interceptors.request.use(
        config => {
            let state = store.getState();
            const {auth: {accessToken}} = state;
            /*
            add Authorization if accessToken is defined
             */
            if (accessToken) {
                return {
                    ...config,
                    headers: {
                        ...config.headers,
                        Authorization: `Bearer ${accessToken}`
                    }
                };
            } else {
                return config;
            }
        },
        (error) => {
            console.error(error);
        }
    );
    axios.interceptors.response.use(value => value, (error) => {
        /*
        test if error contains a data element
         */
        if (error.response.status === 401) {
            auth0Handler.logout();
        } else if (error.response.data !== undefined) {
            const apiError: ApiError = error.response.data;
            // store.dispatch(setError(apiError));
        } else {
            console.error(error);
        }
    });
}