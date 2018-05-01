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
            .then(resp => this.setState({schema: resp.data}));
    }

    render(): React.ReactNode {
        const {schema} = this.state;
        if (!schema) {
            return null;
        }
        return <Form schema={schema}/>;
    }

}