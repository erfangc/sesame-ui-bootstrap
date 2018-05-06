import {createAction} from 'redux-actions';
import {Document} from '../../domain/Document';

type PutDocument = 'PutDocument';
export const PutDocument: PutDocument = 'PutDocument';

export interface Payload {
    document: Document
}

export interface PutDocumentAction {
    type: PutDocument
    payload: Payload
}

export const putDocument = createAction<Payload>(PutDocument);