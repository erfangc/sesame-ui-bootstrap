import {authReducer, AuthStore} from './auth/authReducer';
import {combineReducers, Reducer} from 'redux';

export interface StoreState {
    auth: AuthStore
}

export const rootReducer: Reducer<StoreState> = combineReducers({
    auth: authReducer
});