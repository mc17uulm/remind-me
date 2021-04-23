import React, { Fragment } from "react"
import {Button, Modal} from "semantic-ui-react";
import {__} from "@wordpress/i18n";
import {Icon} from "../Icon";

interface DeleteModalProps<S> {
    title: string,
    content : string
    onClose : () => void,
    onDelete : () => Promise<void>
}

export const DeleteModal = <T extends unknown>(props : DeleteModalProps<T>) => {
    return (
        <Fragment>
            <Modal.Header>{props.title}</Modal.Header>
            <Modal.Content>
                {props.content}
            </Modal.Content>
            <Modal.Actions>
                <Button color="black" onClick={props.onClose}>{__('Back', 'wp-reminder')}</Button>
                <Button color="red" onClick={props.onDelete}><Icon class="trash" /> {__('Delete', 'wp-reminder')}</Button>
            </Modal.Actions>
        </Fragment>
    )
}