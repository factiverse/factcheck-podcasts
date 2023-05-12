import React, { } from 'react';
import { Badge, OverlayTrigger, Popover } from 'react-bootstrap';

export default function HelpPopUp({ header, text, qualifier, badgeClass }) {

    const renderPopover = () => (
        <Popover id={`popover-positioned-${qualifier}`} style={{maxWidth: 450}}>
            <Popover.Header as="h3">{header}</Popover.Header>
            <Popover.Body>
                <p dangerouslySetInnerHTML={{__html: text.split('\n')[0]}}></p>
                <ul>
                {text.split('\n').map((line, index) => (
                    line.length > 0 && index != 0 ? <li key={index} style={{ margin: 0 }} dangerouslySetInnerHTML={{__html: line}}></li> : ''
                ))}
                </ul>
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
            className='d-block'
        >
            <Badge variant="primary" className={badgeClass}>?</Badge>
        </OverlayTrigger>
    );
}