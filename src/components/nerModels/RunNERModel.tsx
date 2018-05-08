import * as React from 'react';
import {connect} from 'react-redux';
import {TextTagger} from '../textTagger/TextTagger';
import {Legend} from '../documents/Legend';
import {NERModel} from '../../domain/NERModel';
import {Corpus} from '../../domain/Corpus';
import axios from 'axios';
import {getSelfLink} from '../../AppUtils';
import {RouteComponentProps} from 'react-router';
import {WithLink} from '../../domain/RestResource';
import {apiRoot} from '../../index';

interface StateProps {
}

function mapStateToProps(): StateProps {
    return {};
}

interface State {
    model?: NERModel
    corpus?: Corpus
    sentence: string
    result: any
}

export const RunNERModel = connect(mapStateToProps)(
    class RunNERModel extends React.Component<StateProps & RouteComponentProps<any>, State> {

        constructor(props: StateProps & RouteComponentProps<any>, context: any) {
            super(props, context);
            this.state = {
                sentence: '',
                result: ''
            };
        }

        public componentDidMount(): void {
            const selfLink = getSelfLink(this.props);
            if (selfLink) {
                axios
                    .get<WithLink<NERModel>>(selfLink)
                    .then(({data}) => {
                        this.setState({model: data});
                        axios.get<Corpus>(data._links.corpus.href)
                            .then(({data}) => this.setState({corpus: data}));
                    });
            }
        }

        public render(): React.ReactNode {
            const {result, sentence, model, corpus} = this.state;
            if (!model || !corpus) {
                return null;
            }
            return (
                <div>
                    <h2>Enter a Sentence to Run</h2>
                    <input
                        className={'form-control'}
                        value={sentence}
                        onChange={({currentTarget: {value}}) => this.setState(() => ({sentence: value}))}
                    />
                    <br/>
                    <button className={'btn btn-success'} onClick={() => this.run()}>Run</button>
                    <h2>Results</h2>
                    <div className={'panel panel-default'}>
                        <div className="panel-body">
                            <TextTagger corpusDescriptor={corpus} onChange={() => null} annotatedText={result}/>

                        </div>
                    </div>
                    <Legend corpusDescriptor={corpus}/>
                </div>
            );
        }

        private run = () => {
            const {sentence, model} = this.state;
            if (model !== undefined) {
                const {modelFilename} = model;
                axios
                    .get<string>(`${apiRoot}/api/v1/ner/${modelFilename}/run`, {params: {sentence}})
                    .then((resp) => this.setState(() => ({result: resp.data})));
            }
        };
    }
);
