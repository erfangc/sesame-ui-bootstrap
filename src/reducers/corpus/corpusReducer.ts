import {ReceiveCorpusDescriptors, ReceiveCorpusDescriptorsAction} from './ReceiveCorpusDescriptors';
import {SetActiveCorpusID, SetActiveCorpusIDAction} from './SetActiveCorpusID';
import {ReceivedCorpus, ReceivedCorpusAction} from './ReceivedCorpus';
import {Corpus} from '../../domain/Corpus';

export type CorpusStore = {
    activeCorpusID?: number
    corpusDescriptors: Corpus[]
}
const initialState: CorpusStore = {corpusDescriptors: []};

type Actions = ReceiveCorpusDescriptorsAction | SetActiveCorpusIDAction | ReceivedCorpusAction

export function corpusReducer(state: CorpusStore = initialState, action: Actions): CorpusStore {
    switch (action.type) {
        case ReceiveCorpusDescriptors:
            return {
                ...state,
                corpusDescriptors: action.payload || []
            };
        case SetActiveCorpusID:
            return {
                ...state,
                activeCorpusID: action.payload
            };
        case ReceivedCorpus:
            let corpusDescriptors;
            if (state.corpusDescriptors.find(({id}) => id === action.payload.id)) {
                corpusDescriptors = state.corpusDescriptors.map((corpusDescriptor) => {
                    if (corpusDescriptor.id === action.payload.id) {
                        return action.payload;
                    } else {
                        return corpusDescriptor;
                    }
                })
            } else {
                corpusDescriptors = [...state.corpusDescriptors, action.payload];
            }
            return {
                ...state,
                activeCorpusID: action.payload.id,
                corpusDescriptors: corpusDescriptors
            };
        default:
            return state;
    }
}