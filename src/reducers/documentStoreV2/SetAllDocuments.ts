import {createAction} from 'redux-actions';
import {Document} from '../../domain/Document';

type SetAllDocuments = 'SetAllDocuments';
export const SetAllDocuments: SetAllDocuments = 'SetAllDocuments';

export interface Payload {
    documents: Document[]
}

export interface SetAllDocumentsAction {
    type: SetAllDocuments
    payload: Payload
}

export const setAllDocuments = createAction<Payload>(SetAllDocuments);