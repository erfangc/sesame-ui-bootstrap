import {EntityConfiguration} from './EntityConfiguration';

export interface Corpus {
    title: string
    userID: string
    entityConfigurations: EntityConfiguration[]
}