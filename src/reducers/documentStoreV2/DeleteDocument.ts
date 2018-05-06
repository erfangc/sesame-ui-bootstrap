import {createAction} from 'redux-actions';

type DeleteDocument = 'DeleteDocument';
export const DeleteDocument: DeleteDocument = 'DeleteDocument';

export interface Payload {
    documentID: string
}

export interface DeleteDocumentAction {
    type: DeleteDocument
    payload: Payload
}

export const deleteDocument = createAction<Payload>(DeleteDocument);