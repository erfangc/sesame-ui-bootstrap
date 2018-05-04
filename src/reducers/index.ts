import {authReducer, AuthStore} from './auth/authReducer';
import {combineReducers, Reducer} from 'redux';
import {corpusReducer, CorpusStore} from './corpus/corpusReducer';
import {documentReducer, DocumentStore} from './document/documentReducer';
import {appReadyReducer} from './appReady';

export interface StoreState {
    auth: AuthStore
    corpusStore: CorpusStore
    documentStore: DocumentStore
    appReady: boolean
}

export const rootReducer: Reducer<StoreState> = combineReducers({
    auth: authReducer,
    corpusStore: corpusReducer,
    documentStore: documentReducer,
    appReady: appReadyReducer
});