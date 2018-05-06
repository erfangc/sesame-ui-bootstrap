/**
 * Server side representation of a document
 */
export interface Document {
    id?: string
    content: string
    corpusID: number
    creatorID: string
    creatorEmail: string
    createdOn: string
    lastModifiedOn: string
    lastModifiedUserID: string
    lastModifiedUserEmail: string
    entities?: TaggedEntity[]
}

export interface TaggedEntity {
    type: string
    value: string
}