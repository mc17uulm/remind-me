import {FormikProps} from "formik";
import {APISettings, SettingsHandler} from "../../api/handler/SettingsHandler";
import {Button, Form, Header, Message, Modal, Tab} from "semantic-ui-react";
import {__} from "@wordpress/i18n";
import React, {useState} from "react";
import {toast} from "react-toastify";

export const LicensePane = (props : FormikProps<APISettings> & {update: () => Promise<void>}) => {

    const [open, updateOpen] = useState<boolean>(false);

    const renderInfo = (active : boolean) => {
        return active ? (
            <span className='wp-reminder-text green'><i className='fa fa-check-circle'></i> {__('Active', 'wp-reminder')}</span>
        ) : (
            <span className='wp-reminder-text red'><i className='fa fa-times-circle'></i> {__('Inactive', 'wp-reminder')}</span>
        )
    }

    const onRemove = async () => {
        const response = await SettingsHandler.remove_license();
        if(response.has_error()) {
            console.error(response.get_error());
            toast.error(response.get_error());
        } else {
            await props.update();
        }
        updateOpen(false);
    }

    return (
        <Tab.Pane attached={false}>
            <h2>{__('License', 'wp-reminder')}</h2>
            <Message info>
                <Message.Header>{__('License info', 'wp-reminder')}</Message.Header>
                {__('With a license you can add multiple events, add and export subscribers, and use the reliable backend of our service. More information at: ', 'wp-reminder')}
                <a href='https://code-leaf.de'>CodeLeaf</a>
            </Message>
            <h3>{__('Your license', 'wp-reminder')}</h3>
            <Form.Group inline>
                <Form.Field>
                    <label>{__('License code', 'wp-reminder')}</label>
                </Form.Field>
                <Form.Input
                    value={props.values.license.code}
                    width={12}
                    disabled={props.values.license.active || props.isSubmitting}
                    name='license.code'
                    onChange={props.handleChange}
                    error={props.errors.license?.code && props.touched.license?.code ? props.errors.license.code : null}
                />
                <Form.Field
                    width={2}
                >
                    <a
                        className={'wp-reminder-delete-link' + (props.values.license.active ? '' : 'wp-reminder-disabled')}
                        onClick={() => {
                            props.values.license.active ? updateOpen(true) : null;
                        }}
                    >
                        <i className='fa fa-trash'></i> {__('Remove license', 'wp-reminder')}
                    </a>
                </Form.Field>
            </Form.Group>
            <Form.Group inline>
                <Form.Field>
                    <label>{__('License info', 'wp-reminder')}</label>
                </Form.Field>
                <Form.Field>
                    {renderInfo(props.values.license.active)}
                </Form.Field>
            </Form.Group>
            <Modal
                closeIcon
                open={open}
                onClose={() => updateOpen(false)}
                onOpen={() => updateOpen(true)}
            >
                <Header>{__('Remove license code', 'wp-reminder')}</Header>
                <Modal.Content>
                    <p>
                        {__('Do you really want to remove your license code from this page?')}
                    </p>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='green' onClick={() => updateOpen(false)}>
                        {__('No', 'wp-reminder')}
                    </Button>
                    <Button color='red' onClick={onRemove}>
                        {__('Yes', 'wp-reminder')}
                    </Button>
                </Modal.Actions>
            </Modal>
        </Tab.Pane>
    )

}