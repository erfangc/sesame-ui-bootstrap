import * as React from 'react';
import {Corpus} from '../../domain/Corpus';
import {Entity, textToToken, Token, tokenToText} from '../../utils/NERUtils';
import {guid} from '../../AppUtils';
import {TaggedEntity} from '../../domain/Document';

interface Props {
    annotatedText: string;
    onChange: (newText: string, entities: TaggedEntity[]) => void;
    corpusDescriptor: Corpus;
}

interface State {
    entityUnderEdit: Entity | undefined;
    menu: { x: number, y: number } | undefined;
    tokens: Token[];
    entities: Entity[];
}

const unknownStyle = {
    color: '#fff',
    backgroundColor: '#666'
};

/**
 * TextTagger is a component that accepts annotated text (either annotated by an NER algorithm or by a human)
 * and enables a user to use the mouse to edit the annotations
 *
 * each submission from this component represents an attempt to manually label the sentence for future training
 */
export class TextTagger extends React.Component<Props, State> {

    public confirmEdit = (type: string) => this.setState(
        ({entityUnderEdit, entities, menu}) => {
            /*
            either we have a new entity or we are updating an existing entity
             */
            if (!entityUnderEdit) {
                return {entityUnderEdit, entities, menu};
            }
            const isNew = entities.find(({id}) => id === entityUnderEdit.id) === undefined;
            if (isNew) {
                return {
                    entityUnderEdit: undefined,
                    entities: [
                        ...entities,
                        {
                            ...entityUnderEdit, type
                        }
                    ],
                    menu: undefined
                };
            } else {
                return {
                    entityUnderEdit: undefined,
                    entities: entities.map((entity) => {
                        if (entity.id === entityUnderEdit.id) {
                            return {...entityUnderEdit, type};
                        } else {
                            return entity;
                        }
                    }),
                    menu: undefined
                };
            }
        },
        () => {
            const {tokens, entities} = this.state;
            const {onChange} = this.props;
            // transform entities to TaggedEntities
            const taggedEntities = this.getTaggedEntities(entities, tokens);
            onChange(tokenToText({entities, tokens}), taggedEntities);
        });
    public cancelEdit = () => this.setState(({entityUnderEdit}) => {
        if (!entityUnderEdit) {
            return {entityUnderEdit};
        } else {
            return {
                entityUnderEdit: undefined
            };
        }
    });
    public resolveTokenEntity = (token: Token): Entity | undefined => {
        const {idx} = token;
        const {entities} = this.state;
        return entities.find(({start, end}) => idx >= start && idx <= end);
    };
    public deleteEntity = () => this.setState(
        ({entityUnderEdit, entities, menu}) => {
            if (!entityUnderEdit) {
                return {entityUnderEdit, entities, menu};
            } else {
                const isNew = entities.find(({id}) => id === entityUnderEdit.id) === undefined;
                if (isNew) {
                    return {entityUnderEdit: undefined, entities, menu: undefined};
                } else {
                    return {
                        entityUnderEdit: undefined,
                        entities: entities.filter((entity) => entity.id !== entityUnderEdit.id),
                        menu: undefined
                    };
                }
            }
        },
        () => {
            const {onChange} = this.props;
            const {entities, tokens} = this.state;
            const taggedEntities = this.getTaggedEntities(entities, tokens);
            onChange(tokenToText({tokens, entities}), taggedEntities);
        }
    );
    public startEntityEdit = (token: Token) => {
        const {entityUnderEdit} = this.state;
        if (entityUnderEdit !== undefined) {
            this.cancelEdit();
        }
        const entity = this.resolveTokenEntity(token);
        if (entity === undefined) {
            /*
            new entity
             */
            this.setState(() => {
                    const newEntity = {end: token.idx, start: token.idx, id: guid(), type: 'unknown'};
                    return {entityUnderEdit: newEntity};
                }
            );
            this.addTokenToEntity(token);
        } else {
            /*
            editing an existing entity
             */
            this.setState(() => {
                const entityUnderEdit = entity ? {...entity} : undefined;
                this.setState(() => ({entityUnderEdit}));
            });
        }
    };
    public addTokenToEntity = (token: Token) => this.setState(({entityUnderEdit, menu}) => {
        if (entityUnderEdit === undefined || menu !== undefined) {
            return {entityUnderEdit};
        }
        return {entityUnderEdit: {...entityUnderEdit, end: Math.max(entityUnderEdit.start, token.idx)}};
    });
    public removeTokenFromEntity = (token: Token) => this.setState(({entityUnderEdit, menu}) => {
        if (entityUnderEdit === undefined || menu !== undefined) {
            return {entityUnderEdit};
        }
        return {entityUnderEdit: {...entityUnderEdit, end: Math.max(entityUnderEdit.start, token.idx - 1)}};
    });
    public resolveTokenStyle = (token: Token) => {
        const baseStyle = {
            padding: `2px`
        };
        const {corpusDescriptor: {entityConfigurations}} = this.props;
        /*
        if the given token is currently being edited, its class is determined by the entity being edited
         */
        const {entityUnderEdit} = this.state;
        if (entityUnderEdit !== undefined && token.idx >= entityUnderEdit.start && token.idx <= entityUnderEdit.end) {
            const entityConfig = entityConfigurations.find(({type}) => type === entityUnderEdit.type);
            if (!entityConfig) {
                return {
                    ...baseStyle,
                    ...unknownStyle
                };
            } else {
                return {
                    ...baseStyle,
                    backgroundColor: entityConfig.color,
                    color: entityConfig.textColor
                };
            }
        } else {
            const resolvedEntity = this.resolveTokenEntity(token);
            if (resolvedEntity !== undefined) {
                /*
                if the resolved entity is also the one being edited, also return undefined
                reaching this code path implies the user has de-selected the token
                 */
                if (entityUnderEdit !== undefined && resolvedEntity.id === entityUnderEdit.id) {
                    return baseStyle;
                } else {
                    /*
                    this code path means this token belongs to an entity and that entity is not being edited,
                    so its class is naturally that of the entity
                     */
                    const entityConfiguration = entityConfigurations.find(({type}) => type === resolvedEntity.type);
                    if (!entityConfiguration) {
                        return {
                            ...baseStyle,
                            ...unknownStyle
                        };
                    } else {
                        return {
                            ...baseStyle,
                            backgroundColor: entityConfiguration.color,
                            color: entityConfiguration.textColor
                        };
                    }
                }
            } else {
                return baseStyle;
            }
        }
    };

    constructor(props: Props) {
        super(props);
        this.state = this.getInitialState(props);
    }

    public getInitialState(props: Props) {
        const {tokens, entities} = textToToken(props.annotatedText);
        /*
        populate colors
         */
        return {
            entityUnderEdit: undefined,
            menu: undefined,
            entities,
            tokens
        };
    }

    public componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
        this.setState(() => this.getInitialState(nextProps));
    }

    public getTaggedEntities(entities: Entity[], tokens: Token[]) {
        return entities.map(entity => {
            return {
                type: entity.type,
                value: tokens.slice(entity.start, entity.end + 1).map(token => token.content).join(' ')
            };
        });
    }

    public render(): React.ReactNode {
        const {corpusDescriptor: {entityConfigurations}} = this.props;
        const {tokens, menu} = this.state;
        const spans = tokens
            .map((token) => {
                    const {idx, content} = token;
                    return (
                        <React.Fragment key={idx}>
                            <span
                                key={idx}
                                style={this.resolveTokenStyle(token)}
                                onClick={
                                    e => {
                                        const {entityUnderEdit} = this.state;
                                        if (entityUnderEdit !== undefined) {
                                            const x = e.clientX;
                                            const y = e.clientY;
                                            this.setState(() => ({menu: {x, y}}));
                                        } else {
                                            this.startEntityEdit(token);
                                        }
                                    }
                                }
                                onMouseEnter={() => this.addTokenToEntity(token)}
                                onMouseLeave={() => this.removeTokenFromEntity(token)}
                            >
                                {content}
                            </span>
                            <span>&nbsp;</span>
                        </React.Fragment>
                    );
                }
            );
        return (
            <div style={{
                cursor: 'pointer',
                userSelect: 'none',
                fontSize: '1.5em',
                wordWrap: 'break-word',
                lineHeight: '1.5em'
            }}>
                {spans}
                {
                    menu !== undefined ?
                        <div style={{position: 'fixed', zIndex: 1, top: menu.y + 10, left: menu.x}}>
                            <ul className={'dropdown-menu'} style={{display: 'inherit'}}>
                                {
                                    entityConfigurations
                                        .filter(entity => entity.type !== 'unknown')
                                        .map(entity =>
                                            <li
                                                key={entity.type}
                                                onClick={() => this.confirmEdit(entity.type)}
                                            >
                                                <a>{entity.displayName}</a>
                                            </li>
                                        )
                                }
                                <li
                                    onClick={() => {
                                        this.setState(() => ({menu: undefined}));
                                        this.cancelEdit();
                                    }}
                                >
                                    <a>Cancel</a>
                                </li>
                                <li onClick={() => this.deleteEntity()}>
                                    <a>Delete</a>
                                </li>
                            </ul>
                        </div>
                        : null
                }
            </div>
        );
    }
}
