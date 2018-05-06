import * as React from 'react';

interface Props {
    value: string
    onSubmit: (newValue: string) => void
    onCancel: () => void
}

interface State {
    value: string
    error?: string
}

export class DocumentContentEditor extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            value: props.value
        };
    }

    render(): React.ReactNode {
        const {value, error} = this.state;
        return (
            <React.Fragment>
                {
                    !error
                        ?
                        value === ''
                            ?
                            <p>&nbsp;</p>
                            :
                            <p>
                                <span style={{color: 'orange'}}>WARNING: </span>
                                Changing the content of the sentence erases existing tags
                            </p>
                        :
                        <p>{error}</p>
                }
                <input
                    className={'form-control'}
                    value={value}
                    onChange={({currentTarget: {value}}) => this.setState(() => ({value, error: undefined}))}
                />
                <br/>
                <button onClick={() => this.onSubmit(value)} className={'btn btn-success'}>
                    Confirm
                </button>
                &nbsp;
                <button onClick={() => this.onCancel(value)} className={'btn btn-warning'}>
                    Cancel
                </button>
            </React.Fragment>
        );
    }

    private onSubmit = (value: string) => {
        const {onSubmit} = this.props;
        if (!value) {
            this.setState(() => ({error: 'Your Input Cannot be Blank'}));
        } else {
            onSubmit(value);
        }
    };

    private onCancel = (value: string) => {
        const {onCancel} = this.props;
        if (!value) {
            this.setState(() => ({error: 'Your Input Cannot be Blank'}));
        } else {
            onCancel();
        }
    };

}