import React, { Fragment } from "react";
import {Table} from "semantic-ui-react";
import {__} from "@wordpress/i18n";

export const Events = () => {


    return (
        <Fragment>
            <a href="" style={{color: "green"}} onClick={e => e.preventDefault()}>{__('Add Event', 'wp-reminder')}</a>
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>X</Table.HeaderCell>
                        <Table.HeaderCell>{__("Events", "wp-reminder")}</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>

                </Table.Body>
            </Table>
        </Fragment>
    );


}