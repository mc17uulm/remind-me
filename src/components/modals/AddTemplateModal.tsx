import {ModalProps} from "./AddEventModal";
import {Button, Form, Modal} from "semantic-ui-react";
import React, {Fragment, useEffect, useState} from "react";
import {__} from "@wordpress/i18n";
import {Editor} from "../editor/Editor";
import {Template, TemplateHandler} from "../../api/handler/TemplateHandler";
import {toast} from "react-toastify";

export const HandleTemplateModal = (props : ModalProps & {template : Template | null}) => {

    const [name, setName] = useState<string>("");
    const [template, setTemplate] = useState<string>(props.template?.html ?? "");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(props.template !== null) {
            setName(props.template.name);
        }
    }, [props.template]);

    const onSubmit = async () => {
        if(name === "") {
            setError(__('Please insert a template name', 'wp-reminder'));
            return;
        }
        let resp;
        if(props.template !== null) {
            resp = await TemplateHandler.update(props.template.id ?? -1, {
                id: props.template.id,
                name: name,
                html: template
            });
        } else {
            resp = await TemplateHandler.set({
                id: null,
                name: name,
                html: template
            });
        }
        if(resp.has_error()) {
            toast.error(resp.get_error());
        } else {
            toast.success(__("Saved template", 'wp-reminder'));
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
                                <Editor initialValue={props.template?.html ?? null} update={(value) => setTemplate(value)} />
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