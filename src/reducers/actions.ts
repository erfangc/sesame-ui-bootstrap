import {authenticateSuccess} from './auth/AuthenticateSuccess';
import {logout} from './auth/Logout';
import {receiveCorpusDescriptors} from './corpus/ReceiveCorpusDescriptors';
import {appNotReady, setAppReady} from './appReady';
import {uiInit} from './sagas/UIInit';
import {putDocument} from './document/PutDocument';
import {setActiveDocument} from './document/SetActiveDocument';
import {trainModel} from './models/trainModel';
import {fetchModels} from './models/FetchModels';
import {deleteModel} from './models/DeleteModel';
import {setActiveModel} from './models/SetActiveModel';
import {deleteDocument} from './document/DeleteDocument';
import {receivedDocuments} from './document/ReceivedDocuments';
import {fetchDocuments} from './document/FetchDocuments';
import {updateUserProfile} from './auth/UpdateUserProfile';
import {setActiveCorpusID} from './corpus/SetActiveCorpusID';
import {clearError} from './error/ClearError';
import {setError} from './error/SetError';

export const actions = {
    logout,
    trainModel,
    setError,
    clearError,
    setActiveCorpusID,
    fetchModels,
    deleteModel,
    fetchDocuments,
    setActiveModel,
    deleteDocument,
    receivedDocuments,
    receiveCorpusDescriptors,
    authenticateSuccess,
    setAppReady,
    appNotReady,
    uiInit,
    putDocument,
    updateUserProfile,
    setActiveDocument
};

export type DispatchProps = typeof actions;