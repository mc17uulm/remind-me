import {SemanticICONS} from "semantic-ui-react";
import {Loader} from "./Loader";
import React, {Fragment} from "react";
import {Placeholder} from "./Placeholder";
import {InitializeStates, InitializerResponse} from "../hooks/useInitializer";
import {Error} from "./Error";

interface LoadingContentProps<S> {
    state: InitializerResponse<S>,
    icon?: SemanticICONS,
    button?: React.ReactNode,
    header: string,
    children: (val : S) => React.ReactNode
}

export const LoadingContent = <T extends unknown>(props : LoadingContentProps<T>) => {

    const hasContent = (value : T) : boolean => {
        if(typeof value === "undefined") return false;
        // @ts-ignore
        if(Array.isArray(value) && value.length === 0) return false;
        return true;
    }

    switch(props.state.state) {
        case InitializeStates.Loading:
            return <Loader/>;
        case InitializeStates.Error:
            return <Error>{props.state.error}</Error>;
        case InitializeStates.Success:
            return !hasContent(props.state.value) ? (
                <Placeholder
                    icon={props.icon}
                    button={props.button}
                >
                    {props.header}
                </Placeholder>
            ) : (
                <Fragment>
                    {props.children(props.state.value)}
                </Fragment>
            )
    }

}