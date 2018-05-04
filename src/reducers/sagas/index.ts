import {all} from 'redux-saga/effects';
import {watchUIInit} from './UIInit';
import {watchPutDocument} from '../document/PutDocument';
import {watchTrainModel} from '../models/trainModel';
import {watchFetchModels} from '../models/FetchModels';
import {watchDeleteModel} from '../models/DeleteModel';
import {watchDeleteDocument} from '../document/DeleteDocument';
import {watchFetchDocuments} from '../document/FetchDocuments';

export const allSagas = function* () {
    yield all(
        [
            watchUIInit(),
            watchPutDocument(),
            watchTrainModel(),
            watchFetchModels(),
            watchDeleteModel(),
            watchDeleteDocument(),
            watchFetchDocuments()
        ]
    );
};