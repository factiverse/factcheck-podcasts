import React, { useState } from 'react';
import { Dropdown, DropdownButton, Badge, Nav, Tab, Form, Card, InputGroup } from 'react-bootstrap';
import { searchPlatforms } from './data.js';



export default function FactCheckQuery({ fc_idx, factChecks, setFactChecks, postToAPI, utterance, agent }) {
    const factCheck = factChecks[fc_idx];
    const [platformDropdown, setPlatformDropdown] = useState('Platform');
    const [queryInput, setQueryInput] = useState(factCheck.query ? factCheck.query : '');

    function handlePlatformDropdownClick(platform, fc_idx) {
        setPlatformDropdown(platform);
        // Update the state with the selected item
        // You can use the same approach as in your previous code snippet
        const newFactChecks = [...factChecks];
        newFactChecks[fc_idx].platform = platform;
        setFactChecks(newFactChecks);
        postToAPI(utterance, newFactChecks, agent);
    }

    return (
        <Form.Group className="mb-3">
            <Form.Label>search phrase or link to search</Form.Label>
            <InputGroup className="mb-3">
                {/* QUERY URL: */}
                <Form.Control
                    type="text"
                    autoComplete='off'
                    value={factCheck.query ? factCheck.query : ''}
                    key={`fc-${fc_idx}-query-input`}
                    onChange={
                        (e) => {
                            //setQueryInput(e.target.value);                            
                            const newFactChecks = [...factChecks];
                            newFactChecks[fc_idx].query = e.target.value;
                            setFactChecks(newFactChecks);
                        }}
                    onBlur={
                        (e) => {
                            postToAPI(utterance, factChecks, agent);
                        }}
                />

                <DropdownButton
                    variant="outline-secondary"
                    title={factCheck.platform ? factCheck.platform : "Platform"}
                    id={`fc-${fc_idx}-platform-dropdown`}
                    key={`fc-${fc_idx}-platform-dropdown`}
                >
                    {/* PLATFORM DROPDOWN: */}
                    {searchPlatforms.map((platform) => (

                        <Dropdown.Item
                            href="#"
                            key={`fc-${fc_idx}-platform-dropdown-${platform.key}`}
                            onClick={() => {
                                handlePlatformDropdownClick(platform.name, fc_idx);
                            }}
                        >{platform.name}
                        </Dropdown.Item>
                    ))}
                </DropdownButton>
            </InputGroup>


        </Form.Group>

    );
}
