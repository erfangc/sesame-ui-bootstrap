import * as React from 'react';
import {Document} from '../../domain/Document';
import {stripNERAnnotations} from '../../utils/NERUtils';
import {CorpusChooser} from '../corpus/corpusChooser/CorpusChooser';
import {Corpus} from '../../domain/Corpus';
import {connect} from 'react-redux';
import {StoreState} from '../../reducers';
import axios from 'axios';
import {apiRoot} from '../../index';
import {history} from '../../History';

interface StateProps {
    corpuses: Corpus[]
}

interface State {
    loading?: boolean
    activeCorpusID: number
    documents?: Document[]
}

function mapStateToProps({corpusStore: {corpusDescriptors}}: StoreState): StateProps {
    return {corpuses: corpusDescriptors};
}

export const AllDocuments = connect(mapStateToProps)(
    class AllDocuments extends React.Component<StateProps, State> {

        private setActiveCorpusID = (corpus: Corpus) => {
            this.setState({activeCorpusID: corpus.id}, () => this.refreshDocumentsForCorpusID(corpus.id));
        };

        constructor(props: StateProps) {
            super(props);
            this.state = {
                activeCorpusID: props.corpuses[0].id
            };
        }

        public componentDidMount(): void {
            const {activeCorpusID} = this.state;
            this.refreshDocumentsForCorpusID(activeCorpusID);
        }

        private refreshDocumentsForCorpusID(corpusID: number) {
            this.setState({loading: true});
            /*
            set timeout because ... elasticsearch replication could be ever so slightly delayed,
            obviously this is a bit of a hack, unless we want to add secondary indices on DynamoDB
            this is not fixable

            the delay is really on the millisecond level though but still
             */
            axios.get<Document[]>(`${apiRoot}/api/v1/documents/by-corpus/${corpusID}`)
                .then(resp => this.setState({documents: resp.data, loading: false}))
                .catch(() => this.setState({loading: false}));

        }

        public render(): React.ReactNode {
            const {corpuses} = this.props;
            const {documents, activeCorpusID, loading} = this.state;
            if (!corpuses) {
                return null;
            }
            return (
                <div>
                    <CorpusChooser onChange={this.setActiveCorpusID} corpusID={activeCorpusID} standalone/>
                    <br/>
                    {
                        loading ? (<div className={'container'}><h1>Loading...</h1></div>) :
                            <table className={'table'}>
                                <thead>
                                <tr>
                                    <th>Content</th>
                                    <th>Creator</th>
                                    <th>Created On</th>
                                    <th>Last Modified By</th>
                                    <th>Last Modified</th>
                                    <th/>
                                    <th/>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    (documents || []).map(document => (
                                        <tr key={document.id}>
                                            <td>{stripNERAnnotations(document.content)}</td>
                                            <td>{document.creatorEmail}</td>
                                            <td>{new Date(document.createdOn).toLocaleString()}</td>
                                            <td>{document.lastModifiedUserEmail}</td>
                                            <td>{new Date(document.lastModifiedOn).toLocaleString()}</td>
                                            <td>
                                                <button
                                                    className="btn btn-warning btn-sm"
                                                    onClick={() => history.push(`/workspace/documents/edit/${document.id}`)}
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => this.deleteDocument(document.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                    }
                    <br/>
                    <button className="btn btn-success"
                            onClick={() => history.push('/workspace/documents/edit')}>Create
                    </button>
                </div>
            );
        }

        private deleteDocument(id: string | undefined) {
            if (!id) {
                return;
            }
            axios
                .delete(`${apiRoot}/api/v1/documents/${id}`)
                .then(() => {
                    this.setState(prevState => {
                        /*
                        update local state so we see the document removed immediately
                         */
                        const {documents} = prevState;
                        if (documents) {
                            return {
                                ...prevState,
                                documents: documents.filter((doc) => doc.id !== id)
                            };
                        } else {
                            return prevState;
                        }
                    });
                });
        }
    }
);