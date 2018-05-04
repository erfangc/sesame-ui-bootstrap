import {Action, createAction} from 'redux-actions';
import {Document} from '../../domain/Document';

type SetActiveDocument = 'SetActiveDocument';
export const SetActiveDocument: 'SetActiveDocument' = 'SetActiveDocument';
export interface SetActiveDocumentAction extends Action<Document> {
    type: SetActiveDocument
}

export const setActiveDocument = createAction<Document | null>(SetActiveDocument);