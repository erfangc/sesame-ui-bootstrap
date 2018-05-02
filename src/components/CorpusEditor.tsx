import Form, {IChangeEvent} from 'react-jsonschema-form';
import * as React from 'react';
import {JSONSchema6} from 'json-schema';
import axios from 'axios';
import {apiRoot} from '../index';
import {history} from '../History';

interface Props {
    self: string
}

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
        const {self} = this.props;
        if (self !== undefined) {
            axios
                .get(self)
                .then(resp => this.setState({formData: resp.data}));
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
        const {self} = this.props;
        if (self) {
            axios
                .put(self, e.formData)
                .then(() => history.push('/workspace/corpuses'));
        } else {
            axios
                .post(`${apiRoot}/corpuses`, e.formData)
                .then(() => history.push('/workspace/corpuses'));
        }
    };

}