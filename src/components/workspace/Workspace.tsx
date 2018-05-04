import * as React from 'react';
import {Route, Switch} from 'react-router';
import {CorpusEditor} from '../CorpusEditor';
import {Navbar} from './Navbar';
import {AllCorpuses} from '../AllCorpuses';
import {DocumentTagger} from '../documents/DocumentTagger';
import {StoreState} from '../../reducers';
import {connect} from 'react-redux';

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
                            <Route path={'/workspace/documents/tagger'} component={DocumentTagger}/>
                            <Route path={'/workspace/corpuses'} component={AllCorpuses}/>
                        </Switch>
                    </div>
                </React.Fragment>
            );
        }
    }
);