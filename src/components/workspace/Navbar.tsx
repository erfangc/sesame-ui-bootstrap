import * as React from 'react';

export class Navbar extends React.Component {
    public render(): React.ReactNode {
        return (
            <nav className="navbar navbar-default navbar-static-top">
                <div className="container">
                    <div className="navbar-header">
                        <a className="navbar-brand">Sesame Lab</a>
                    </div>
                </div>
            </nav>
        );
    }
}