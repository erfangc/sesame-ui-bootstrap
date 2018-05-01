import Form from 'react-jsonschema-form';
import * as React from 'react';
import {JSONSchema6} from 'json-schema';
import axios from 'axios';
import {apiRoot} from '../index';

interface Props {
    id: number
}

interface State {
    schema?: JSONSchema6
    formData?: any
}

export class CorpusEditor extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public componentWillMount(): void {
        axios
            .get<JSONSchema6>(`${apiRoot}/profile/corpuses`, {headers: {accept: 'application/schema+json'}})
            .then(({data}) => {
                /*
                remove unnecessary fields, maybe there are gentler ways to do this ...
                in the entity model itself
                 */
                if (data.properties) {
                    delete data.properties.nerModels;
                    delete data.properties.userID;
                }
                this.setState({schema: data});
            });
        const {id} = this.props;
        if (id !== undefined) {
            axios
                .get(`${apiRoot}/corpuses/${id}`)
                .then(resp => this.setState({formData: resp.data}));
        }
    }

    public render(): React.ReactNode {
        const {schema, formData} = this.state;
        if (!schema) {
            return null;
        }
        return <Form
            schema={schema}
            formData={formData}
            uiSchema={
                {
                    'ui:order': ['title', 'entityConfigurations'],
                    'entityConfigurations': {
                        items: {
                            'ui:order': ['type', 'displayName', 'color', 'textColor']
                        }
                    }
                }
            }
        />;
    }

}