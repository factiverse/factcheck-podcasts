import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownButton, Form, InputGroup } from 'react-bootstrap';
import { searchPlatforms } from '../data.js';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function FactCheckQuery({ fc_idx, factChecks, setFactChecks, postToAPI, utterance, agent }) {
    const [factCheck, setFactCheck] = useState(factChecks[fc_idx]);
    const [platformDropdown, setPlatformDropdown] = useState('Platform');
    const [inputValue, setInputValue] = useState(factCheck.query || '');

    function isValidURL(str) {
        try {
            new URL(str);
            return true;
        } catch (e) {
            return false;
        }
    }

    function matchURLWithPlatform(url) {
        const domain = new URL(url).hostname;
        const matchedPlatform = searchPlatforms.find((platform) =>
            domain.includes(platform.key)
        );
        return matchedPlatform ? matchedPlatform.name : null;
    }

    function getQueryStringFromURL(url) {
        try {
            const parsedURL = new URL(url);
            let queryString = parsedURL.searchParams.get('q') || parsedURL.searchParams.get('p');
            return queryString ? queryString.replace(/\+/g, ' ') : null;
        } catch (e) {
            return null;
        }
    }
    useEffect(() => {
        setFactCheck(factChecks[fc_idx]);
    }, [factChecks, fc_idx]);

    useEffect(() => {
        setInputValue(factCheck.query || '');
    }, [factCheck]);

    function validateInsertQuery(fc) {
        const hasQuery = fc.query ? fc.query && fc.query.trim().length > 0 : false;
        const hasPlatform = fc.platform ? fc.platform && fc.platform !== 'Platform' : false;
        const valid = hasQuery && hasPlatform;
        const newFactCheck = { ...fc, valid: valid };
        setFactCheck(newFactCheck);
        const newFactChecks = [...factChecks];
        newFactChecks[fc_idx] = newFactCheck;
        setFactChecks(newFactChecks);
        return valid;
    }

    function handlePlatformDropdownClick(platform) {
        setPlatformDropdown(platform);
        let newFactCheck = { ...factCheck, platform: platform };
        newFactCheck.valid = validateInsertQuery(newFactCheck);
        let newFactChecks = [...factChecks];
        newFactChecks[fc_idx] = newFactCheck;
        postToAPI(utterance, newFactChecks, agent);
    }

    return (
        <Form.Group className="mb-3">
            <Form.Label className='d-flex mt-2'>
                <p className='m-0'>
                    <em>QUERY</em> search phrase or link to search
                </p>
            </Form.Label>
            <InputGroup className="mb-3">

                {/* QUERY URL: */}
                <Form.Control
                    type="text"
                    autoComplete='off'
                    value={inputValue}
                    key={`fc-${fc_idx}-query-input`}
                    onChange={
                        (e) => {
                            // Add this block to handle URL input
                            if (isValidURL(e.target.value)) {
                                const matchedPlatform = matchURLWithPlatform(e.target.value);
                                if (matchedPlatform) {
                                    setPlatformDropdown(matchedPlatform);
                                    const queryString = getQueryStringFromURL(e.target.value);
                                    let qs = queryString ? queryString : e.target.value;
                                    setInputValue(qs);
                                    let newFactCheck = { ...factCheck, query: qs, platform: matchedPlatform };
                                    newFactCheck.valid = validateInsertQuery(newFactCheck);
                                    let newFactChecks = [...factChecks];
                                    newFactChecks[fc_idx] = newFactCheck;
                                    postToAPI(utterance, newFactChecks, agent);
                                    return;
                                }
                            }
                            setInputValue(e.target.value);
                            const newFactCheck = { ...factCheck, query: e.target.value };
                            validateInsertQuery(newFactCheck);
                        }}
                    onBlur={
                        (e) => {
                            if (e.target.value.trim().length > 0) {
                                postToAPI(utterance, factChecks, agent);
                            }
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
                <InputGroup.Text className='ps-1' style={{ backgroundColor: "transparent" }}>
                    {factCheck.valid ? (
                        <span style={{ color: 'green', marginLeft: '5px' }}>
                            <FaCheck />
                        </span>
                    ) : (
                        <span style={{ color: 'red', marginLeft: '5px' }}>
                            <FaTimes />
                        </span>
                    )}
                </InputGroup.Text>
            </InputGroup>
        </Form.Group>
    )
}
