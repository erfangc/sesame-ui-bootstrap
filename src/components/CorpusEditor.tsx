import Form from 'react-jsonschema-form';
import * as React from 'react';
import {JSONSchema6} from 'json-schema';
import axios from 'axios';
import {apiRoot} from '../index';

interface State {
    schema?: JSONSchema6
}

export class CorpusEditor extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    componentWillMount(): void {
        axios
            .get<JSONSchema6>(`${apiRoot}/profile/corpuses`, {headers: {accept: 'application/schema+json'}})
            .then(resp => {
                /*
                remove unnecessary fields, maybe there are gentler ways to do this ...
                in the entity model itself
                 */
                if (resp.data.properties) {
                    delete resp.data.properties['nerModels'];
                    delete resp.data.properties['userID'];
                    delete resp.data.properties['id'];
                }
                this.setState({schema: resp.data});
            });
    }

    render(): React.ReactNode {
        const {schema} = this.state;
        if (!schema) {
            return null;
        }
        return <Form
            schema={schema}
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