import * as React from 'react';
import {Route, Router, Switch} from 'react-router';
import {LandingPage} from './LandingPage';
import {history} from './History';
import {Workspace} from './components/workspace/Workspace';

class App extends React.Component {
    public render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path={'/workspace'} component={Workspace}/>
                    <Route path={'/'} component={LandingPage}/>
                </Switch>
            </Router>
        );
    }
}

export default App;
