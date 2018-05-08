import {Corpus} from './Corpus';

export interface NERModel {
    name: string
    description: string
    userID: string
    createdOn: string
    fileLocation: string
    corpus: number | Corpus
}