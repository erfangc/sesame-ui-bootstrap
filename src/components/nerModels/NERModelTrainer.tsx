import * as React from 'react';
import {connect} from 'react-redux';
import {NERModel} from '../../domain/NERModel';
import {JSONSchema6} from 'json-schema';
import Form, {ISubmitEvent} from 'react-jsonschema-form';
import axios from 'axios';
import {apiRoot} from '../../index';
import {RouteComponentProps} from 'react-router';
import {parse} from 'querystring';
import {Corpus} from '../../domain/Corpus';
import {StoreState} from '../../reducers';
import {history} from '../../History';

interface StateProps {
    corpuses: Corpus[]
}

interface State {
    schema?: JSONSchema6
    nerModel?: NERModel
}

interface OwnProps extends RouteComponentProps<any> {

}

function mapStateToProps({corpusStore: {corpusDescriptors}}: StoreState): StateProps {
    return {corpuses: corpusDescriptors};
}

export const NERModelTrainer = connect(mapStateToProps)(
    class NERModelTrainer extends React.Component<StateProps & OwnProps, State> {

        constructor(props: StateProps & OwnProps, context: any) {
            super(props, context);
            this.state = {};
        }

        public componentDidMount(): void {
            axios
                .get<JSONSchema6>(`${apiRoot}/api/v1/profile/nermodels`, {headers: {accept: 'application/schema+json'}})
                .then(({data}) => this.setState({
                    schema: {
                        ...data, required: [
                            'name',
                            'description',
                            'corpus'
                        ]
                    }
                }));
            const {location} = this.props;
            if (location && location.search) {
                const parsed = parse(location.search);
                if (parsed['href'] || parsed['?href']) {
                    axios
                        .get((parsed['href'] || parsed['?href']).toString())
                        .then(resp => this.setState({nerModel: resp.data}));
                }
            }
        }

        public render(): React.ReactNode {
            const {schema, nerModel} = this.state;
            if (!schema) {
                return null;
            }
            const {corpuses} = this.props;
            const uiSchema = {
                'userID': {
                    'ui:disabled': true
                },
                'createdOn': {
                    'ui:disabled': true
                },
                'fileLocation': {
                    'ui:disabled': true
                },
                'modelFilename': {
                    'ui:disabled': true
                },
                'corpus': {}
            };
            const enhancedSchema: any = {
                ...schema,
                properties: {
                    ...schema.properties,
                    corpus: {
                        title: 'Corpus',
                        type: 'number',
                        enum: [corpuses.map(({id}) => id)],
                        enumNames: [corpuses.map(({title}) => title)]
                    }
                }
            };
            return (
                <Form
                    schema={enhancedSchema}
                    formData={nerModel}
                    uiSchema={uiSchema}
                    onSubmit={this.onSubmit}
                />
            );
        }

        public onSubmit = (event: ISubmitEvent<NERModel>) => {
            const {formData} = event;
            axios
                .post(`${apiRoot}/api/v1/ner/train`, null, {
                        params: {
                            corpusID: formData.corpus,
                            name: formData.name,
                            description: formData.description
                        }
                    }
                )
                .then(() => history.push('/workspace/nermodels'));
        };
    }
);
