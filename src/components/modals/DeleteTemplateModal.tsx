import {ModalProps} from "./AddEventModal";
import {Button, Modal} from "semantic-ui-react";
import React from "react";
import {__, sprintf} from "@wordpress/i18n";
import {Template, TemplateHandler} from "../../api/handler/TemplateHandler";
import {Icon} from "../Icon";
import {toast} from "react-toastify";

export const DeleteTemplateModal = (props : ModalProps & {template : Template | null}) => {

    const onDelete = async () => {
        if(props.template !== null && props.template.id !== null) {
            const resp = await TemplateHandler.delete(props.template.id ?? -1);
            if(resp.has_error()) {
                toast.error(resp.get_error());
                props.onClose();
            } else {
                toast.success(__('Deleted template', 'wp-reminder'));
                props.onSuccess();
            }
        }
    }

    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
            dimmer='blurring'
        >
            <Modal.Header>{__('Delete Template', 'wp-reminder')}</Modal.Header>
            <Modal.Content>
                {sprintf(__('Do you really like to delete the template "%s"?', 'wp-reminder'), props.template?.name)}
            </Modal.Content>
            <Modal.Actions>
                <Button color="black" onClick={props.onClose}>{__('Back', 'wp-reminder')}</Button>
                <Button color="red" onClick={onDelete}><Icon class="trash" /> {__('Delete', 'wp-reminder')}</Button>
            </Modal.Actions>
        </Modal>
    )

}