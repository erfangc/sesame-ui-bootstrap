import {Action, createAction} from 'redux-actions';
import {Document} from '../../domain/Document';

type ReceivedDocuments = 'ReceivedDocuments';
export const ReceivedDocuments: ReceivedDocuments = 'ReceivedDocuments';
interface Payload {
    documents: Document[]
}
export interface ReceivedDocumentsAction extends Action<Payload> {
    type: ReceivedDocuments
}

export const receivedDocuments = createAction<Payload>(ReceivedDocuments);