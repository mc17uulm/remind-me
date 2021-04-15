import {Button, Form, Modal} from "semantic-ui-react";
import React, {Fragment, useEffect, useState} from "react";
import {__, sprintf} from "@wordpress/i18n";
import {Editor} from "../editor/Editor";
import {Template, TemplateHandler} from "../../api/handler/TemplateHandler";
import {toast} from "react-toastify";
import {HandableModalType, ModalProps} from "./HandableModal";
import {Icon} from "../Icon";

export const HandleTemplateModal = (props : ModalProps<Template>) => {

    const [name, setName] = useState<string>("");
    const [template, setTemplate] = useState<string>(props.element?.html ?? "");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(props.element !== null) {
            setName(props.element.name);
        } else {
            setName("");
        }
    }, [props.element]);

    const onSubmit = async () => {
        if(name === "") {
            setError(__('Please insert a template name', 'wp-reminder'));
            return;
        }
        let resp;
        if(props.element !== null && props.element.id !== null) {
            if(props.type === HandableModalType.EDIT) {
                resp = await TemplateHandler.update(props.element.id, {
                    id: props.element.id,
                    name: name,
                    html: template
                });
            } else if(props.type === HandableModalType.DELETE) {
               resp = await TemplateHandler.delete(props.element.id);
            } else {
                return;
            }
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

    const onDelete = async () => {
        if(props.element !== null && props.element.id !== null) {
            const resp = await TemplateHandler.delete(props.element.id ?? -1);
            if(resp.has_error()) {
                toast.error(resp.get_error());
                props.onClose();
            } else {
                toast.success(__('Deleted template', 'wp-reminder'));
                props.onSuccess();
            }
        }
    }

    const renderContent = () => {
        return (
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
                                <Editor initialValue={props.element?.html ?? null} update={(value) => setTemplate(value)} />
                            </Form.Field>
                        </Form.Group>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={props.onClose}>{__('Back', 'wp-reminder')}</Button>
                    <Button color='green' onClick={() => onSubmit()}>{__('Save', 'wp-reminder')}</Button>
                </Modal.Actions>
            </Fragment>
        )
    }

    const renderConfirmation = () => {
        return (
            <Fragment>
                <Modal.Header>{__('Delete Template', 'wp-reminder')}</Modal.Header>
                <Modal.Content>
                    {sprintf(__('Do you really like to delete the template "%s"?', 'wp-reminder'), props.element?.name)}
                </Modal.Content>
                <Modal.Actions>
                    <Button color="black" onClick={props.onClose}>{__('Back', 'wp-reminder')}</Button>
                    <Button color="red" onClick={onDelete}><Icon class="trash" /> {__('Delete', 'wp-reminder')}</Button>
                </Modal.Actions>
            </Fragment>
        )
    }

    const getContent = () => {
        switch(props.type) {
            case HandableModalType.EDIT:
            case HandableModalType.ADD:
                return renderContent();
            case HandableModalType.DELETE:
                return renderConfirmation();
            default:
                return <Fragment></Fragment>;
        }
    }

    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
        >
            {getContent()}
        </Modal>
    )

}