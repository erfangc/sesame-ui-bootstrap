import * as React from 'react';
import {connect} from 'react-redux';
import {Corpus} from '../../domain/Corpus';
import {StoreState} from '../../reducers';
import axios from 'axios';
import {NERModel} from '../../domain/NERModel';
import {JSONSchema6} from 'json-schema';
import Form, {ISubmitEvent} from 'react-jsonschema-form';
import {RouteComponentProps} from 'react-router';
import {parse} from 'querystring';
import {history} from '../../History';

interface StateProps {
    corpuses: Corpus[]
}

function mapStateToProps({corpusStore: {corpusDescriptors}}: StoreState): StateProps {
    return {corpuses: corpusDescriptors};
}

interface State {
    schema: JSONSchema6
    formData?: NERModel
}

interface OwnProps extends RouteComponentProps<any> {

}

export const NERModelEditor = connect(mapStateToProps)(
    class NERModelEditor extends React.Component<StateProps & OwnProps, State> {

        constructor(props: StateProps & OwnProps) {
            super(props);
            this.state = {
                schema: {
                    definitions: {},
                    type: 'object',
                    '$schema': 'http://json-schema.org/schema#',
                    title: 'NER Model',
                    properties: {
                        name: {
                            title: 'Name',
                            type: 'string'
                        },
                        description: {
                            title: 'Name',
                            type: 'string'
                        },
                        fileLocation: {
                            title: 'File location',
                            type: 'string'
                        },
                        userID: {
                            title: 'User id',
                            type: 'string'
                        },
                        createdOn: {
                            title: 'Created on',
                            type: 'string'
                        }
                    }
                }
            };
        }

        private getSelfLink() {
            const {location} = this.props;
            if (location && location.search) {
                const search = parse(location.search);
                if (search.href || search['?href']) {
                    return (search.href || search['?href']).toString();
                }
            }
            return null;
        }

        public componentDidMount(): void {
            const selfLink = this.getSelfLink();
            if (selfLink) {
                axios
                    .get<NERModel>(selfLink)
                    .then(({data}) => this.setState({formData: data}));
            }
        }

        public render(): React.ReactNode {
            const {formData, schema} = this.state;
            return (
                <Form
                    schema={schema}
                    uiSchema={{createdOn: {'ui:widget': 'datetime'}}}
                    formData={formData}
                    onSubmit={this.onSubmit}
                />
            );
        }

        private onSubmit = (e: ISubmitEvent<NERModel>) => {
            const selfLink = this.getSelfLink();
            if (selfLink) {
                axios
                    .put(selfLink, e.formData)
                    .then(() => history.push('/workspace/nermodels'));
            }
        };
    }
);
