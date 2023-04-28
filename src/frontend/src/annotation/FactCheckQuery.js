import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownButton, Form, InputGroup } from 'react-bootstrap';
import { searchPlatforms } from './data.js';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function FactCheckQuery({ fc_idx, factChecks, setFactChecks, postToAPI, utterance, agent }) {
    const [factCheck, setFactCheck] = useState(factChecks[fc_idx]);
    const [platformDropdown, setPlatformDropdown] = useState('Platform');
    const [isValid, setIsValid] = useState(factCheck.valid);

    useEffect(() => {
        setFactCheck(factChecks[fc_idx]);
        validateFactCheckQuery();
    }, [factChecks, fc_idx]);

    useEffect(() => {
        validateFactCheckQuery();
    }, [factCheck]);

    function validateFactCheckQuery() {
        const hasQuery = factCheck.query ? factCheck.query && factCheck.query.trim().length > 0 : false;
        const hasPlatform = factCheck.platform ? factCheck.platform && factCheck.platform !== 'Platform' : false;
        setIsValid(hasQuery && hasPlatform);
        return hasQuery && hasPlatform;
    }

    function handlePlatformDropdownClick(platform, fc_idx) {
        setPlatformDropdown(platform);
        const newFactCheck = { ...factCheck, platform: platform, valid: validateFactCheckQuery() };
        setFactCheck(newFactCheck);
        const newFactChecks = [...factChecks];
        newFactChecks[fc_idx] = newFactCheck;
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
                            const newFactCheck = { ...factCheck, query: e.target.value, valid: validateFactCheckQuery() };
                            setFactCheck(newFactCheck);                     
                            const newFactChecks = [...factChecks];
                            newFactChecks[fc_idx] = newFactCheck;
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
                    value={platformDropdown}
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
                {isValid ? (
                    <span style={{ color: 'green', marginRight: '5px' }}>
                        <FaCheck />
                    </span>
                ) : (
                    <span style={{ color: 'red', marginRight: '5px' }}>
                        <FaTimes />
                    </span>
                )}
            </InputGroup>


        </Form.Group>

    );
}
