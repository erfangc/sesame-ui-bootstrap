import * as React from 'react';
import {connect} from 'react-redux';
import {TextTagger} from '../textTagger/TextTagger';
import axios from 'axios';
import {DocumentContentEditor} from './DocumentContentEditor';
import {Legend} from './Legend';
import {StoreState} from '../../reducers';
import {CorpusChooser} from '../corpus/corpusChooser/CorpusChooser';
import {stripNERAnnotations} from '../../utils/NERUtils';
import {Corpus} from '../../domain/Corpus';
import {UserProfile} from '../../reducers/auth/authReducer';
import {actions, DispatchProps} from '../../reducers/actions';
import {RouteComponentProps} from 'react-router';
import {Document, TaggedEntity} from '../../domain/Document';
import {apiRoot} from '../../index';
import {history} from '../../History';

interface StateProps {
    corpuses: Corpus[]
    userProfile?: UserProfile
}

function mapStateToProps({auth: {userProfile}, corpusStore: {corpusDescriptors}}: StoreState): StateProps {
    return {corpuses: corpusDescriptors, userProfile};
}

interface State {
    loading: boolean
    editingSentence: boolean
    document?: Document
}

interface OwnProps extends RouteComponentProps<any> {

}

export const DocumentEditor = connect(mapStateToProps, {...actions})(
    class DocumentTagger extends React.Component<StateProps & OwnProps & DispatchProps, State> {

        constructor(props: StateProps & OwnProps & DispatchProps) {
            super(props);
            this.state = this.getInitialState(props);
        }

        render(): React.ReactNode {
            const {corpuses} = this.props;
            const {editingSentence, loading, document} = this.state;
            if (!document) {
                return null;
            }
            const {content, corpusID} = document;
            const corpus = corpuses.find(({id}) => id === corpusID);
            if (corpus == null) {
                throw `could not find corpus with id = ${corpusID} in ${JSON.stringify(corpus)}`;
            }
            return (
                <React.Fragment>
                    <div>
                        <CorpusChooser
                            onChange={(corpusDescriptor) => this.changeCorpus(corpusDescriptor.id)}
                            disabled={editingSentence}
                            corpusID={corpusID}
                            standalone
                        />
                        <br/>
                        {
                            editingSentence
                                ?
                                <DocumentContentEditor
                                    onCancel={() => this.setState(() => ({editingSentence: false}))}
                                    onSubmit={(content) => this.updateContent(content, [])}
                                    value={stripNERAnnotations(content)}
                                />
                                :
                                <React.Fragment>
                                    <p>Highlight part of the sentence and identify what they are</p>
                                    <TextTagger
                                        annotatedText={content}
                                        onChange={(content, entities) => this.updateContent(content, entities)}
                                        corpusDescriptor={corpus}
                                    />
                                    <br/>
                                    <button
                                        className={'btn btn-primary'}
                                        onClick={() => this.setState(() => ({editingSentence: true}))}
                                    >
                                        Edit the Sentence
                                    </button>
                                </React.Fragment>
                        }
                        <Legend corpusDescriptor={corpus}/>
                    </div>
                    <button
                        onClick={this.submit}
                        disabled={loading || editingSentence}
                        className={'btn btn-primary'}
                    >
                        Save
                    </button>
                    &nbsp;
                    <button
                        disabled={loading || editingSentence}
                        onClick={() => history.push('/workspace/documents/edit')}
                        className={'btn btn-success'}
                    >
                        Create New
                    </button>
                </React.Fragment>
            );
        }

        public componentWillReceiveProps(nextProps: Readonly<StateProps & OwnProps & DispatchProps>, nextContext: any): void {
            this.setState(state => ({...state, ...this.getInitialState(nextProps)}));
        }

        private updateContent = (content: string, entities: TaggedEntity[]) => this.setState(prevState => {
            const {document} = prevState;
            if (!document) {
                return;
            }
            const newState: State = {
                ...prevState,
                editingSentence: false,
                document: {
                    ...document,
                    content,
                    entities
                }
            };
            return newState;
        });

        private changeCorpus = (corpusID: number) => this.setState(prevState => {
            const {document} = prevState;
            if (!document) {
                return;
            }
            const newState: State = {
                ...prevState,
                document: {
                    ...document,
                    corpusID,
                    content: stripNERAnnotations(document.content)
                }
            };
            return newState;
        });

        private getInitialState(props: StateProps & OwnProps & DispatchProps): State {
            const {userProfile, corpuses} = props;
            if (userProfile === undefined) {
                throw 'user profile is not defined';
            }

            /*
            if the path matches that of an document ID then we should go ahead and
            and fetch it from the server, otherwise we are editing a new document
             */
            const {match} = props;
            if (match && match.params && match.params.id) {
                /*
                otherwise we are editing an existing document, and we need to fetch that document from
                the server
                 */
                axios
                    .get<Document>(`${apiRoot}/api/v1/documents/${match.params.id}`)
                    .then(resp => this.setState({document: resp.data}));

                return {
                    loading: false,
                    editingSentence: false,
                    document: undefined
                };
            } else {
                const {email, id} = userProfile;
                return {
                    loading: false,
                    editingSentence: true,
                    document: {
                        content: '',
                        corpusID: corpuses[0].id,
                        entities: [],
                        lastModifiedOn: new Date().toISOString(),
                        lastModifiedUserID: id,
                        lastModifiedUserEmail: email,
                        createdOn: new Date().toISOString(),
                        creatorID: id,
                        creatorEmail: email
                    }
                };
            }

        }

        private submit = () => {
            const {document} = this.state;
            this.setState({loading: true});
            axios
                .post(`${apiRoot}/api/v1/documents`, document)
                /*
                set a timeout here because ... it takes about a second for Elasticsearch to receive and process DynamoDB Stream
                yeah, we have a fairly strong consistency guarantee on the DynamoDB write side but not on the replication /read side
                which is ok for most applications but not here ...

                alternatively, we can 'stall' the user by asking them to navigate back manually?
                 */
                .then(() => setTimeout(() => history.push('/workspace/documents'), 1500));
        };
    }
);