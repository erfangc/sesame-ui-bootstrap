import * as React from 'react';
import {Corpus} from '../../domain/Corpus';

interface LegendProps {
    corpusDescriptor: Corpus
}

export class Legend extends React.Component<LegendProps> {
    render(): React.ReactNode {
        const {corpusDescriptor: {entityConfigurations}} = this.props;
        return (
            <div>
                <h2>Legend</h2>
                <div>
                    {
                        Object
                            .keys(entityConfigurations)
                            .map(type => (
                                    <div key={type}>
                                                <span
                                                    style={{borderLeft: `10px solid ${entityConfigurations[type].color}`}}
                                                >
                                                    &nbsp;
                                                </span>
                                        {entityConfigurations[type].displayName}
                                    </div>
                                )
                            )
                    }
                </div>
            </div>
        );
    }
}