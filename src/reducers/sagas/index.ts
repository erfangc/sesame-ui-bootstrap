import {all} from 'redux-saga/effects';
import {watchUIInit} from './UIInit';

export const allSagas = function* () {
    yield all(
        [
            watchUIInit()
        ]
    );
};