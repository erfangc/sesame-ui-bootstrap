import Form, {IChangeEvent} from 'react-jsonschema-form';
import * as React from 'react';
import {JSONSchema6} from 'json-schema';
import axios from 'axios';
import {apiRoot} from '../../index';
import {history} from '../../History';
import {RouteComponentProps} from 'react-router';
import {parse} from 'querystring';

interface State {
    schema?: JSONSchema6
    formData?: any
}

const uiSchema = {
    'ui:order': ['title', 'entityConfigurations'],
    'entityConfigurations': {
        items: {
            'ui:order': ['type', 'displayName', 'color', 'textColor'],
            'color': {
                'ui:widget': 'color'
            },
            'textColor': {
                'ui:widget': 'color'
            }
        }
    }
};

export class CorpusEditor extends React.Component<RouteComponentProps<any>, State> {

    constructor(props: RouteComponentProps<any>) {
        super(props);
        this.state = {};
    }

    public componentDidMount(): void {
        axios
            .get<JSONSchema6>(`${apiRoot}/api/v1/profile/corpuses`, {headers: {accept: 'application/schema+json'}})
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
        const {location} = this.props;
        if (location && location.search) {
            const parsed = parse(location.search);
            if (parsed['href'] || parsed['?href']) {
                axios
                    .get((parsed['href'] || parsed['?href']).toString())
                    .then(resp => this.setState({formData: resp.data}));
            }
        }
    }

    public render(): React.ReactNode {
        const {schema, formData} = this.state;
        if (!schema) {
            return null;
        }
        return (
            <Form
                schema={schema}
                formData={formData}
                uiSchema={uiSchema}
                onSubmit={this.onSubmit}
            />
        );
    }

    private onSubmit = (e: IChangeEvent<any>) => {
        const {location} = this.props;
        if (location && location.search) {
            const parsed = parse(location.search);
            if (parsed['href'] || parsed['?href']) {
                axios
                    .put((parsed['href'] || parsed['?href']).toString(), e.formData)
                    .then(() => history.push('/workspace/corpuses'));
            }
        } else {
            axios
                .post(`${apiRoot}/api/v1/corpuses`, e.formData)
                .then(() => history.push('/workspace/corpuses'));
        }
    };

}