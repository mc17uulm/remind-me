import React, {Fragment, useEffect, useState} from "react"
import {Template, TemplateHandler} from "../api/handler/TemplateHandler";
import {toast} from "react-toastify";
import {Card} from "semantic-ui-react";
import {__} from "@wordpress/i18n";
import {AddTemplateModal} from "../components/modals/AddTemplateModal";

export const Templates = () => {

    const [addOpen, setAddOpen] = useState<boolean>(false);
    const [templates, setTemplates] = useState<Template[]>([]);

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
        setAddOpen(false);
    }

    return (
        <Fragment>
            <a href="#" style={{color: "green"}} onClick={(e) => {e.preventDefault(); setAddOpen(true);}}>{__('Add Template', 'wp-reminder')}</a>
            {templates.map((template: Template, index : number) => (
                <Card>
                    <Card.Content>
                        <div>
                            {template.html}
                        </div>
                        <Card.Header>{template.name}</Card.Header>
                    </Card.Content>
                    <Card.Content extra>
                        <a href="#">{__('Edit', 'wp-reminder')}</a>
                        <a href="#" style={{color: "red"}}>{__('Delete', 'wp-reminder')}</a>
                    </Card.Content>
                </Card>
            ))}
            <AddTemplateModal open={addOpen} onClose={() => setAddOpen(false)} onSuccess={onSuccess} />
        </Fragment>
    )
}