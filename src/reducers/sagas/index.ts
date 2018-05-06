import {all} from 'redux-saga/effects';
import {watchUIInit} from './UIInit';
import {watchTrainModel} from '../models/trainModel';
import {watchFetchModels} from '../models/FetchModels';
import {watchDeleteModel} from '../models/DeleteModel';

export const allSagas = function* () {
    yield all(
        [
            watchUIInit(),
            watchTrainModel(),
            watchFetchModels(),
            watchDeleteModel()
        ]
    );
};