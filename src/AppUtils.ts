import {parse} from "querystring";
import {RouteComponentProps} from 'react-router';

export function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
export function getSelfLink(props: RouteComponentProps<any>) {
    const {location} = props;
    if (location && location.search) {
        const search = parse(location.search);
        if (search.href || search['?href']) {
            return (search.href || search['?href']).toString();
        }
    }
    return null;
}
