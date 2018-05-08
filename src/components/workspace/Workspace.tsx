import * as React from 'react';
import {Route, Switch} from 'react-router';
import {CorpusEditor} from '../corpus/CorpusEditor';
import {Navbar} from './Navbar';
import {AllCorpuses} from '../corpus/AllCorpuses';
import {DocumentEditor} from '../documents/DocumentEditor';
import {StoreState} from '../../reducers';
import {connect} from 'react-redux';
import {AllDocuments} from '../documents/AllDocuments';
import {NERModelTrainer} from '../nerModels/NERModelTrainer';
import {AllNERModels} from '../nerModels/AllNERModels';
import {RunNERModel} from '../nerModels/RunNERModel';
import {NERModelEditor} from '../nerModels/NERModelEditor';

interface StateProps {
    appReady: boolean
}

function mapStateToProps({appReady}: StoreState): StateProps {
    return {appReady};
}

export const Workspace = connect(mapStateToProps)(
    class Workspace extends React.Component<StateProps> {
        public render(): React.ReactNode {
            const {appReady} = this.props;
            if (!appReady) {
                return null;
            }
            return (
                <React.Fragment>
                    <Navbar/>
                    <div className="container">
                        <Switch>
                            <Route path={'/workspace/corpuses/edit'} component={CorpusEditor}/>
                            <Route path={'/workspace/documents/edit/:id'} component={DocumentEditor}/>
                            <Route path={'/workspace/documents/edit'} component={DocumentEditor}/>
                            <Route path={'/workspace/nermodels/train'} component={NERModelTrainer}/>
                            <Route path={'/workspace/nermodels/run/:id'} component={RunNERModel}/>
                            <Route path={'/workspace/nermodels/edit'} component={NERModelEditor}/>
                            <Route path={'/workspace/nermodels'} component={AllNERModels}/>
                            <Route path={'/workspace/documents'} component={AllDocuments}/>
                            <Route path={'/workspace/corpuses'} component={AllCorpuses}/>
                        </Switch>
                    </div>
                </React.Fragment>
            );
        }
    }
);