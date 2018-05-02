import * as React from 'react';
import {Route, Switch} from 'react-router';
import {CorpusEditor} from '../CorpusEditor';
import {Navbar} from './Navbar';
import {AllCorpuses} from '../AllCorpuses';

export class Workspace extends React.Component {
    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <Navbar/>
                <div className="container">
                    <Switch>
                        <Route path={'/workspace/corpuses/edit'} component={CorpusEditor}/>
                        <Route path={'/workspace/corpuses'} component={AllCorpuses}/>
                    </Switch>
                </div>
            </React.Fragment>
        );
    }
}