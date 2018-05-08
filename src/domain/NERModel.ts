import {Corpus} from './Corpus';

export interface NERModel {
    name: string
    description: string
    userID: string
    createdOn: string
    fileLocation: string
    modelFilename: string
    corpus: number | Corpus
}