import {authenticateSuccess} from './auth/AuthenticateSuccess';
import {logout} from './auth/Logout';
import {receiveCorpusDescriptors} from './corpus/ReceiveCorpusDescriptors';
import {appNotReady, setAppReady} from './appReady';
import {uiInit} from './sagas/UIInit';
import {trainModel} from './models/trainModel';
import {fetchModels} from './models/FetchModels';
import {deleteModel} from './models/DeleteModel';
import {setActiveModel} from './models/SetActiveModel';
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
    setActiveModel,
    receiveCorpusDescriptors,
    authenticateSuccess,
    setAppReady,
    appNotReady,
    uiInit,
    updateUserProfile
};

export type DispatchProps = typeof actions;