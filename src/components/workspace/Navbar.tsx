import * as React from 'react';
import {history} from '../../History';

export class Navbar extends React.Component {
    public render(): React.ReactNode {
        const {pathname} = history.location;
        return (
            <nav className="navbar navbar-default navbar-static-top">
                <div className="container">
                    <div className="navbar-header">
                        <a className="navbar-brand" onClick={() => history.push('/')}>Sesame Lab</a>
                    </div>
                    <div className="navbar-collapse collapse">
                        <ul className="nav navbar-nav">
                            <li className={pathname.startsWith('/workspace/documents') ? 'active': ''}>
                                <a onClick={() => history.push('/workspace/documents')}>Documents</a>
                            </li>
                            <li className={pathname.startsWith('/workspace/corpuses') ? 'active': ''}>
                                <a onClick={() => history.push('/workspace/corpuses')}>Corpuses</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}