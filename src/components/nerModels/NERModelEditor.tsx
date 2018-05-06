import * as React from 'react';
import {connect} from 'react-redux';

interface StateProps {

}

function mapStateToProps(): StateProps {
    return {};
}

export const NERModelEditor = connect(mapStateToProps)(
    class NERModelEditor extends React.Component<StateProps> {
        render(): React.ReactNode {
            return null;
        }
    }
);
