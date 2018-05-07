import * as React from 'react';
import {connect} from 'react-redux';
import {RestResource, WithLink} from '../../domain/RestResource';
import {NERModel} from '../../domain/NERModel';
import axios from 'axios';
import {apiRoot} from '../../index';

interface StateProps {

}

interface State {
    nerModels?: WithLink<NERModel>[]
}

function mapStateToProps(): StateProps {
    return {};
}

export const AllNERModels = connect(mapStateToProps)(
    class AllNERModels extends React.Component<StateProps, State> {
        constructor(props: StateProps) {
            super(props);
            this.state = {};
        }

        public componentDidMount(): void {
            axios
                .get<RestResource<NERModel>>(`${apiRoot}/api/v1/nermodels`)
                .then(resp => {
                    this.setState({nerModels: resp.data._embedded.nermodels});
                });
        }

        public render(): React.ReactNode {
            const {nerModels} = this.state;
            return (
                <div>
                    <table className={'table'}>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Created On</th>
                            <th/>
                            <th/>
                            <th/>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            (nerModels || []).map(nerModel => (
                                <tr key={nerModel._links.self.href}>
                                    <td>{nerModel.name}</td>
                                    <td>{nerModel.description}</td>
                                    <td>{new Date(nerModel.createdOn).toLocaleString()}</td>
                                    <td>
                                        <button className="btn btn-warning btn-sm">
                                            Edit
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger btn-sm">
                                            Delete
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btn-success btn-sm">
                                            Run
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                    <br/>
                    <button className="btn btn-success">Create</button>
                </div>
            );
        }
    }
);
