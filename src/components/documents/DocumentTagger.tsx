import * as React from 'react';
import {connect} from 'react-redux';
import {TextTagger} from '../textTagger/TextTagger';
import {DocumentEditor} from './DocumentEditor';
import {Legend} from './Legend';
import {StoreState} from '../../reducers';
import {CorpusChooser} from '../corpusChooser/CorpusChooser';
import {stripNERAnnotations} from '../../utils/NERUtils';
import {Corpus} from '../../domain/Corpus';
import {UserProfile} from '../../reducers/auth/authReducer';
import {Document, TaggedEntity} from '../../domain/Document';
import {actions, DispatchProps} from '../../reducers/actions';

interface StateProps {
    corpuses: Corpus[]
    activeDocument?: Document
    userProfile?: UserProfile
}

function mapStateToProps({auth: {userProfile}, corpusStore: {corpusDescriptors}, documentStore: {activeDocument}}: StoreState): StateProps {
    return {corpuses: corpusDescriptors, activeDocument, userProfile};
}

interface State {
    loading: boolean
    editingSentence: boolean
    document: Document
}

interface OwnProps {

}

export const DocumentTagger = connect(mapStateToProps,{...actions})(
    class DocumentTagger extends React.Component<StateProps & OwnProps & DispatchProps, State> {

        constructor(props: StateProps & OwnProps & DispatchProps) {
            super(props);
            this.state = this.getInitialState(props);
        }

        render(): React.ReactNode {
            const {corpuses} = this.props;
            const {editingSentence, loading, document: {corpus: corpusID, content}} = this.state;
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
                                <DocumentEditor
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
                        onClick={this.createNew}
                        className={'btn btn-success'}
                    >
                        Create New
                    </button>
                </React.Fragment>
            );
        }

        componentWillReceiveProps(nextProps: Readonly<StateProps & OwnProps & DispatchProps>, nextContext: any): void {
            this.setState(state => ({...state, ...this.getInitialState(nextProps)}));
        }

        private updateContent = (content: string, entities: TaggedEntity[]) => this.setState(({document}) => ({
            editingSentence: false,
            document: {
                ...document,
                content,
                entities
            }
        }));

        private changeCorpus = (corpus: string) => {
            // if we are changing corpus, then all existing tagged entities are removed
            this.setState(({document}) => ({
                document: {
                    ...document,
                    corpus,
                    content: stripNERAnnotations(document.content)
                }
            }));
        };

        private getInitialState(props: StateProps & OwnProps & DispatchProps): State {
            const {activeDocument, userProfile, corpuses} = props;
            if (userProfile === undefined) {
                throw 'user profile is not defined';
            }
            /*
            if active document is not set, then we are dealing with a brand new document
             */
            if (activeDocument == null) {
                const {email, id, nickname} = userProfile;
                return {
                    loading: false,
                    editingSentence: true,
                    document: {
                        content: '',
                        corpus: corpuses[0].id,
                        entities: [],
                        lastModifiedOn: new Date().valueOf(),
                        lastModifiedBy: id,
                        lastModifiedByNickname: nickname,
                        lastModifiedByEmail: email,
                        createdOn: new Date().valueOf(),
                        createdBy: id,
                        createdByNickname: nickname,
                        createdByEmail: email
                    }
                };
            } else {
                /*
                otherwise we are editing an existing document
                 */
                return {
                    loading: false,
                    editingSentence: false,
                    document: {
                        ...activeDocument
                    }
                };
            }
        }

        private submit = () => {
            const {document} = this.state;
            const {putDocument} = this.props;
            this.setState(() => ({loading: true}));
            putDocument({
                onComplete: () => this.setState(() => ({loading: false})),
                document
            });
        };

        private createNew = () => {
            const {setActiveDocument} = this.props;
            setActiveDocument(null);
        };
    }
);