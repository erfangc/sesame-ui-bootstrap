import {EntityConfiguration} from './EntityConfiguration';

export interface Corpus {
    id: string
    title: string
    userID: string
    entityConfigurations: EntityConfiguration[]
}