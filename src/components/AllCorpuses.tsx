import * as React from 'react';
import {Corpus} from '../domain/Corpus';
import axios from 'axios';
import {apiRoot} from '../index';
import {RestResource, WithLink} from '../domain/RestResource';
import {history} from '../History';

interface State {
    corpuses?: WithLink<Corpus>[]
}

export class AllCorpuses extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    public componentDidMount(): void {
        axios
            .get<RestResource<Corpus>>(`${apiRoot}/corpuses`)
            .then(({data: {_embedded}}) => this.setState({corpuses: _embedded.corpuses}));
    }

    public render(): React.ReactNode {
        const {corpuses} = this.state;
        if (corpuses === undefined) {
            return null;
        }
        return (
            <table className="table">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>User ID</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                {
                    corpuses.map(({id, userID, title, _links: {self: {href}}}) => (
                        <tr key={id}>
                            <td>{title}</td>
                            <td>{userID}</td>
                            <td>
                                <button
                                    className={'btn btn-warning btn-sm'}
                                    onClick={() => history.push(`/workspace/corpuses/edit?self=${href}`)}
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        );
    }
}