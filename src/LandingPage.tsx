import * as React from 'react';
import {Component} from 'react';
import {auth0Handler} from './reducers/auth/auth0/Auth0Handler';

export class LandingPage extends Component {
    render(): React.ReactNode {
        return (
            <div className="jumbotron jumbotron-fluid">
                <div className="container">

                    <h1 className="display-3">Welcome to UI Assisted NLP!</h1>
                    <p className="lead">
                        Sesame Lab is a Name Entity training UI based on OpenNLP
                    </p>
                    <hr className="my-4"/>
                    <p>
                        We emphasize collaborative training across shared corpus. With the power of the community, no
                        data set is too large to train!
                    </p>
                    <p className="lead">
                        <a className="btn btn-primary btn-lg" role="button" onClick={() => auth0Handler.login()}>
                            Sign In
                        </a>
                    </p>

                </div>
            </div>
        );
    }
}