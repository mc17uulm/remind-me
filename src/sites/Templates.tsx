import React, {Fragment, useEffect, useState} from "react"
import {Template, TemplateHandler} from "../api/handler/TemplateHandler";
import {toast} from "react-toastify";
import {Card, Label} from "semantic-ui-react";
import {__} from "@wordpress/i18n";
import {HandleTemplateModal} from "../components/modals/HandleTemplateModal";
import "./../styles/template.scss";
import {HandableModalType} from "../components/modals/HandableModal";
import {ResponseObject} from "../api/Request";
import {useModalSelect} from "../hooks/ModalSelect";


export const Templates = () => {

    const [modal, selectedElements, handleModalCheck] = useModalSelect<ResponseObject<Template>>();
    const [templates, setTemplates] = useState<ResponseObject<Template>[]>([]);

    const loadTemplates = async () : Promise<void> => {
        const resp = await TemplateHandler.get_all();
        if(resp.has_error()) {
            toast.error(resp.get_error());
        } else {
            setTemplates(resp.get_value());
        }
    }

    useEffect(() => {
        loadTemplates();
    }, []);

    const onSuccess = async () => {
        await loadTemplates();
        handleModalCheck.hide();
    }

    const renderLabel = (template : ResponseObject<Template>) => {
        return (
            <Label color={template.active ? 'green' : 'red'} horizontal>
                {template.active ? __('active', 'wp-reminder') : __('not-active', 'wp-reminder')}
            </Label>
        )
    }

    return (
        <Fragment>
            <a className="wp-reminder-add-link" onClick={handleModalCheck.onAdd}>{__('Add Template', 'wp-reminder')}</a>
            <br />
            <Card.Group>
            {templates.map((template: ResponseObject<Template>, index : number) => (
                <Card key={`template_${index}`}>
                    <Card.Content>
                        <div
                            dangerouslySetInnerHTML={{__html: template.html}}
                            className="wp-reminder-template-preview">
                        </div>
                        <Card.Header>
                            <span className="left floated">{template.name}</span>
                            <span className="right floated">{renderLabel(template)}</span>
                        </Card.Header>
                    </Card.Content>
                    <Card.Content extra>
                        <a
                            className="wp-reminder-edit-link"
                            onClick={(e) => handleModalCheck.onEdit(e, template)}
                        >{__('Edit', 'wp-reminder')}</a>
                        <span className="right floated">
                            <a
                                className="wp-reminder-delete-link"
                                onClick={(e) => handleModalCheck.onDelete(e, template)}
                            >
                                {__('Delete', 'wp-reminder')}
                            </a>
                        </span>
                    </Card.Content>
                </Card>
            ))}
            </Card.Group>
            <HandleTemplateModal
                open={modal !== HandableModalType.HIDE}
                elements={selectedElements}
                element={selectedElements[0]}
                type={modal}
                onClose={handleModalCheck.onClose}
                onSuccess={onSuccess}
            />
        </Fragment>
    )
}