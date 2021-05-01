import {SemanticICONS} from "semantic-ui-react";
import {Loader} from "./Loader";
import React, { Fragment } from "react";
import {Placeholder} from "./Placeholder";

interface LoadingContentProps {
    initialized: boolean,
    hasContent: boolean,
    icon?: SemanticICONS,
    button?: React.ReactNode,
    header: string,
    children?: React.ReactNode
}

export const LoadingContent = (props : LoadingContentProps) => {

    if(!props.initialized) return (<Loader />);
    if(props.hasContent) {
        return (
            <Fragment>
                {props.children}
            </Fragment>
        );
    } else {
        return (
            <Placeholder
                icon={props.icon}
                button={props.button}
            >
                {props.header}
            </Placeholder>
        )
    }

}