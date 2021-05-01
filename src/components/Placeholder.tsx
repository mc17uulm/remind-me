import React from "react";
import {Header, Icon, Segment, SemanticICONS} from "semantic-ui-react";

interface PlaceholderProps {
    icon?: SemanticICONS,
    button?: React.ReactNode,
    children?: React.ReactNode
}

export const Placeholder = (props : PlaceholderProps) => {

    const renderIcon = () => {
        if(typeof props.icon !== "undefined") {
            return (
                <Icon name={props.icon} />
            )
        }
        return "";
    }

    const renderButton = () => {
        if(typeof props.button !== "undefined") {
            return props.button;
        }
        return "";
    }

    return (
        <Segment placeholder>
            <Header icon={typeof props.icon !== "undefined"}>
                {renderIcon()}
                {props.children}
            </Header>
            {renderButton()}
        </Segment>
    )

}