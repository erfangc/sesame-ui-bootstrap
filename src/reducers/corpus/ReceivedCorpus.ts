import {createAction} from 'redux-actions';
import {Corpus} from '../../domain/Corpus';

type ReceivedCorpus = 'ReceivedCorpus';
export const ReceivedCorpus: ReceivedCorpus = 'ReceivedCorpus';

export interface ReceivedCorpusAction {
    type: ReceivedCorpus
    payload: Corpus
}

export const receivedCorpus = createAction<Corpus>(ReceivedCorpus);