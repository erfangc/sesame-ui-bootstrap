import * as React from 'react';
import {connect} from 'react-redux';

interface StateProps {

}

function mapStateToProps(): StateProps {
    return {};
}

export const AllNERModels = connect(mapStateToProps)(
    class AllNERModels extends React.Component<StateProps> {
        render(): React.ReactNode {
            return null;
        }
    }
);
