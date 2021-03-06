import React, { Fragment } from "react"
import {Button, Icon, Modal} from "semantic-ui-react";
import {__} from "@wordpress/i18n";

interface DeleteModalProps {
    title: string,
    children? : React.ReactNode,
    onClose : () => void,
    onDelete : () => Promise<void>,
    loading? : boolean
}

export const DeleteModal = (props : DeleteModalProps) => {
    return (
        <Fragment>
            <Modal.Header>{props.title}</Modal.Header>
            <Modal.Content>
                {props.children}
            </Modal.Content>
            <Modal.Actions>
                <Button color="black" onClick={props.onClose}>{__('Back', 'remind-me')}</Button>
                <Button color="red" disabled={props.loading} loading={props.loading} onClick={props.onDelete}><Icon name='trash' /> {__('Delete', 'remind-me')}</Button>
            </Modal.Actions>
        </Fragment>
    )
}