import React, { } from 'react';
import { Badge, OverlayTrigger, Popover } from 'react-bootstrap';

export default function HelpPopUp({ header, text, qualifier, badgeClass}) {

    const renderPopover = () => (
        <Popover id={`popover-positioned-${qualifier}`}>
            <Popover.Header as="h3">{header}</Popover.Header>
            <Popover.Body>
                {text}
            </Popover.Body>
        </Popover>
    );

    return (

        <OverlayTrigger
            trigger="click"
            key={`overlay-trigger-${qualifier}`}
            placement={"auto"}
            rootClose={true}
            overlay={
                renderPopover()
            }
        >
            <Badge variant="primary" className={badgeClass}>?</Badge>
        </OverlayTrigger>
    );
}