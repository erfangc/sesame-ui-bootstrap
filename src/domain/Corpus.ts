import {EntityConfiguration} from './EntityConfiguration';

export interface Corpus {
    id: number
    title: string
    userID: string
    entityConfigurations: EntityConfiguration[]
}