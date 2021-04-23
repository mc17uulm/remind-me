import {Button, Form, Modal, Popup} from "semantic-ui-react";
import React, {Fragment, useEffect, useState} from "react";
import {__, _n, sprintf} from "@wordpress/i18n";
import {Editor} from "../editor/Editor";
import {Template, TemplateHandler} from "../../api/handler/TemplateHandler";
import {toast} from "react-toastify";
import {HandableModalProps, HandableModalType} from "./HandableModal";
import {DeleteModal} from "./DeleteModal";
import {Either} from "../../api/Either";
import {ResponseObject} from "../../api/Request";
import {Info} from "../Info";
import {Icon} from "../Icon";

export const HandleTemplateModal = (props : HandableModalProps<ResponseObject<Template>>) => {

    const [name, setName] = useState<string>("");
    const [template, setTemplate] = useState<string>("");
    const [active, setActive] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(props.type === HandableModalType.EDIT) {
            setName(props.element.name);
            setTemplate(props.element.html);
            setActive(props.element.active);
        } else {
            setName("");
            setTemplate("");
            setActive(false);
        }
    }, [props.type]);

    const onSubmit = async () => {
        if(name === "") {
            setError(__('Please insert a template name', 'wp-reminder'));
            return;
        }
        const resp = await sendRequest();
        if(resp.has_error()) {
            toast.error(resp.get_error());
        } else {
            toast.success(__("Saved template", 'wp-reminder'));
            props.onSuccess();
        }
    }

    const sendRequest = async () : Promise<Either<any>> => {
        switch(props.type) {
            case HandableModalType.EDIT:
                return await TemplateHandler.update(props.element.id, {
                    id: props.element.id,
                    name: name,
                    html: template,
                    active: active
                });
            case HandableModalType.DELETE:
                return await TemplateHandler.delete(props.elements.map(val => val.id));
            case HandableModalType.ADD:
                return await TemplateHandler.set({
                    name: name,
                    html: template,
                    active: active
                });
            default: return Either.error("");
        }
    }

    const renderContent = () => {
        const element = (props.type === HandableModalType.EDIT) ? props.element : null;
        return (
            <Fragment>
                <Modal.Header>{__('Add Template', 'wp-reminder')}</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={onSubmit}>
                        <Form.Group>
                            <Form.Checkbox
                                toggle
                                checked={active}
                                onChange={(e, d) => {e.preventDefault(); setActive(d.checked ?? false)}}
                                label={__('Active', 'wp-reminder')}
                            />
                            <Info>{__('Only one template can be active', 'wp-reminder')}</Info>
                        </Form.Group>
                        <Form.Group>
                            <Form.Input
                                width={16}
                                value={name}
                                label={__('Template name', 'wp-reminder')}
                                placeholder={__('Template name', 'wp-reminder')}
                                onChange={(e) => {e.preventDefault(); setName(e.target.value)}}
                                error={error}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Field width={16}>
                                <label>{__('Template', 'wp-reminder')}</label>
                                <Editor initialValue={element?.html ?? null} update={(value) => setTemplate(value)} />
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
        if(props.type === HandableModalType.DELETE) {
            return (
                <DeleteModal
                    title={__('Delete Template', 'wp-reminder')}
                    content={
                        sprintf(
                            _n(
                                'Do you really like to delete the template "%s"?',
                                'Do you really like to delete the templates [%s]?',
                                props.elements.length,
                                'wp-reminder'
                            ),
                            props.elements[0].name,
                            props.elements.map(val => val.name).join(", ")
                        )
                    }
                    onClose={props.onClose}
                    onDelete={onSubmit}
                />
            );
        }
        return "";
    }

    const getContent = () => {
        switch(props.type) {
            case HandableModalType.EDIT:
            case HandableModalType.ADD:
                return renderContent();
            case HandableModalType.DELETE:
                return renderConfirmation();
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