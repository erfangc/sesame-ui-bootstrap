import {Document} from '../../domain/Document';
import {SetAllDocumentsAction} from './SetAllDocuments';
import {DeleteDocumentAction} from './DeleteDocument';

interface DocumentStoreV2 {
    /**
     * raw array of all the documents
     */
    documents: Document[]
    /**
     * map of id to document
     */
    documentByID: { [id: string]: Document }
}

const initialState: DocumentStoreV2 = {
    documentByID: {},
    documents: []
};

type Action = SetAllDocumentsAction | DeleteDocumentAction

function reducer(state: DocumentStoreV2 = initialState, action: Action): DocumentStoreV2 {
    return state;
}