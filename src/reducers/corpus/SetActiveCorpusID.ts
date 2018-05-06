import {createAction} from 'redux-actions';

type SetActiveCorpusID = 'SetActiveCorpusID';
export const SetActiveCorpusID: SetActiveCorpusID = 'SetActiveCorpusID';
export interface SetActiveCorpusIDAction {
    type: SetActiveCorpusID
    payload: number | undefined
}

export const setActiveCorpusID = createAction<number | undefined>(SetActiveCorpusID);
