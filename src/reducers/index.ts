import {authReducer, AuthStore} from './auth/authReducer';
import {combineReducers, Reducer} from 'redux';
import {corpusReducer, CorpusStore} from './corpus/corpusReducer';
import {appReadyReducer} from './appReady';

export interface StoreState {
    auth: AuthStore
    corpusStore: CorpusStore
    appReady: boolean
}

export const rootReducer: Reducer<StoreState> = combineReducers({
    auth: authReducer,
    corpusStore: corpusReducer,
    appReady: appReadyReducer
});