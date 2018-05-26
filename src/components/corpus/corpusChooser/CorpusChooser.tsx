import * as React from 'react';
import {Corpus} from '../../../domain/Corpus';
import axios from 'axios';
import {RestResource} from '../../../domain/RestResource';
import {apiRoot} from '../../../index';

interface State {
    corpusDescriptors?: Corpus[]
}

interface OwnProps {
    label?: string
    corpusID?: number
    disabled?: boolean
    standalone?: boolean
    onChange: (corpusDescriptor: Corpus) => void
}

export class CorpusChooser extends React.Component<OwnProps, State> {

    constructor(props: OwnProps, context: any) {
        super(props, context);
        this.state = {};
    }

    public componentDidMount(): void {
        axios
            .get<RestResource<Corpus>>(`${apiRoot}/api/v1/corpuses`)
            .then(({data}) => this.setState({corpusDescriptors: data._embedded.corpuses}));
    }

    public render(): React.ReactNode {
        const {label, disabled, corpusID, standalone} = this.props;
        const {corpusDescriptors} = this.state;
        if (!corpusDescriptors) {
            return null;
        }
        const options = corpusDescriptors.map(({id, title}) => ({
            key: id,
            value: id,
            text: title
        }));
        const value = corpusID !== undefined ? corpusID : corpusDescriptors.length > 0 ? corpusDescriptors[0].id : '';
        const formField = (
            <React.Fragment>
                <label>{label || 'Corpus'}</label>
                <select
                    className="form-control"
                    value={value}
                    disabled={disabled}
                    onChange={({target: {value}}) => this.changeCorpus(parseFloat(value))}
                >
                    {
                        options
                            .map(({value, text, key}, idx) =>
                                <option key={idx} value={value}>{text}</option>
                            )
                    }
                </select>
            </React.Fragment>
        );
        return standalone ? (<form>{formField}</form>) : (formField);
    }

    private changeCorpus = (value: number) => {
        const {onChange} = this.props;
        const {corpusDescriptors} = this.state;
        if (!corpusDescriptors) {
            return;
        }
        const corpusDescriptor = corpusDescriptors.find(({id}) => value === id);
        if (!corpusDescriptor) {
            return;
        } else {
            onChange(corpusDescriptor);
        }
    };
}
