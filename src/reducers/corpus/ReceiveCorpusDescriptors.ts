import {Action, createAction} from 'redux-actions';
import {Corpus} from '../../domain/Corpus';

type ReceiveCorpusDescriptors = 'ReceiveCorpusDescriptors';
export const ReceiveCorpusDescriptors: ReceiveCorpusDescriptors = 'ReceiveCorpusDescriptors';

export interface ReceiveCorpusDescriptorsAction extends Action<Corpus[]> {
    type: ReceiveCorpusDescriptors
}
export const receiveCorpusDescriptors = createAction<Corpus[]>(ReceiveCorpusDescriptors);