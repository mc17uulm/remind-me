import {Fragment, useEffect, useState} from "react";
import {Template, TemplateHandler} from "../../api/handler/TemplateHandler";
import {toast} from "react-toastify";
import {Button, DropdownItemProps, Form, Icon, Modal} from "semantic-ui-react";
import React from "react";
import { Formik } from "formik";
import {empty_event} from "../../api/handler/EventHandler";
import {__} from "@wordpress/i18n";

const transform_templates = (templates : Template[]) : DropdownItemProps[] => {
    return templates.map((template : Template, index : number) => {
        return {
            key: `template_${index}`,
            value: template.id ?? -1,
            text: template.name
        }
    });
}

export interface ModalProps {
    open: boolean,
    onClose: () => void,
    onSuccess: () => void
}

export const AddEventModal = (props : ModalProps) => {

    const [templates, setTemplates] = useState<DropdownItemProps[]>([]);

    const loadTemplates = async () => {
        const resp = await TemplateHandler.get_all();
        if(resp.has_error()) {
            toast.error(resp.get_error());
        } else {
            setTemplates(transform_templates(resp.get_value()));
        }
    }

    useEffect(() => {
        loadTemplates();
    }, []);

    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
        >
            <Formik
                initialValues={empty_event()}
                onSubmit={async (values, actions) => {
                    console.log(values);
                }}
            >
                {formik_props => (
                    <Fragment>
                        <Modal.Header>{__('Add Event', 'wp-reminder')}</Modal.Header>
                        <Modal.Content>
                            <Form onSubmit={formik_props.handleSubmit}>
                                <Form.Group>
                                    <Form.Input
                                        width={10}
                                        value={formik_props.values.name}
                                        name="name"
                                        label={__('Event name', 'wp-reminder')}
                                        placeholder={__('Event name', 'wp-reminder')}
                                        onChange={formik_props.handleChange}
                                        error={formik_props.errors.name}
                                    />
                                    <Form.Select
                                        width={6}
                                        value={formik_props.values.template}
                                        options={templates}
                                        label={__('Templates', 'wp-reminder')}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='black' onClick={props.onClose}>{__('Back', 'wp-reminder')}</Button>
                            <Button color='green' disabled={formik_props.isSubmitting} onClick={() => formik_props.handleSubmit}><Icon name="save" /> {__('Save', 'wp-reminder')}</Button>
                        </Modal.Actions>
                    </Fragment>
                )}
            </Formik>
        </Modal>
    )

}