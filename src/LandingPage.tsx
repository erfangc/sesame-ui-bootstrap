import * as React from 'react';
import {Component} from 'react';
import {auth0Handler} from './reducers/auth/auth0/Auth0Handler';
import {history} from './History';
import {connect} from 'react-redux';
import {AuthStore} from './reducers/auth/authReducer';
import {StoreState} from './reducers';
import {DispatchProps} from './reducers/actions';

interface StateProps {
    auth: AuthStore
}

function mapStateToProps({auth}: StoreState): StateProps {
    return {
        auth
    };
}

export const LandingPage = connect(mapStateToProps)(
    class LandingPage extends Component<StateProps & DispatchProps> {
        render(): React.ReactNode {
            const {logout, auth: {expiresAt}} = this.props;
            let isLoggedIn = new Date().getTime() < expiresAt;
            return (
                <div className="jumbotron jumbotron-fluid">
                    <div className="container">

                        <h1 className="display-3">Welcome to UI Assisted NLP!</h1>
                        <p className="lead">
                            Sesame Lab is a Name Entity training UI based on OpenNLP
                        </p>
                        <hr className="my-4"/>
                        <p>
                            We emphasize collaborative training across shared corpus. With the power of the community,
                            no
                            data set is too large to train!
                        </p>
                        <p className="lead">
                            {
                                isLoggedIn && (
                                    <a className="btn btn-primary btn-lg"
                                       onClick={() => history.push('/workspace/documents')}>
                                        Go to Home Page
                                    </a>
                                )
                            }
                            {
                                !isLoggedIn && (
                                    <a className="btn btn-primary btn-lg" role="button"
                                       onClick={() => auth0Handler.login()}>
                                        Sign In
                                    </a>
                                )
                            }
                            {
                                isLoggedIn && (
                                    <React.Fragment>
                                        &nbsp;
                                        <a className="btn btn-primary btn-lg" onClick={() => logout()}>
                                            Log Out
                                        </a>
                                    </React.Fragment>
                                )
                            }
                        </p>

                    </div>
                </div>
            );
        }
    }
);