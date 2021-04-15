import {ModalProps} from "./AddEventModal";
import {Button, Form, Modal} from "semantic-ui-react";
import React, {Fragment, useState} from "react";
import {__} from "@wordpress/i18n";
import {Editor} from "../editor/Editor";
import {TemplateHandler} from "../../api/handler/TemplateHandler";
import {toast} from "react-toastify";

export const AddTemplateModal = (props : ModalProps) => {

    const [name, setName] = useState<string>("");
    const [template, setTemplate] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async () => {
        if(name === "") {
            setError(__('Please insert a template name', 'wp-reminder'));
            return;
        }
        const resp = await TemplateHandler.set({
            id: null,
            name: name,
            html: template
        });
        if(resp.has_error()) {
            toast.error(resp.get_error());
        } else {
            toast.success("Saved template");
            props.onSuccess();
        }
    }

    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
        >
            <Fragment>
                <Modal.Header>{__('Add Template', 'wp-reminder')}</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={onSubmit}>
                        <Form.Group>
                            <Form.Input
                                width={16}
                                value={name}
                                name="name"
                                label={__('Template name', 'wp-reminder')}
                                placeholder={__('Template name', 'wp-reminder')}
                                onChange={(e) => {e.preventDefault(); setName(e.target.value)}}
                                error={error}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Field width={16}>
                                <label>{__('Template', 'wp-reminder')}</label>
                                <Editor update={(value) => setTemplate(value)} />
                            </Form.Field>
                        </Form.Group>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={props.onClose}>{__('Back', 'wp-reminder')}</Button>
                    <Button color='green' onClick={() => onSubmit()}>{__('Save', 'wp-reminder')}</Button>
                </Modal.Actions>
            </Fragment>
        </Modal>
    )

}