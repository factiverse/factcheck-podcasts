import React, { useEffect } from 'react';
import { TextAnnotate } from "react-text-annotate-blend"
import axios from 'axios';

const COLORS = {
    ClaimSpan: "rgb(179, 245, 66)",
};
// function to convert the value state into a simple array of objects,
// with only the start and end properties and returned as a string
const convertValueToString = (value) => {
    if (value.length === 0) {
        return "";
    } else {
        return JSON.stringify(value.map((item) => {
            return {
                start: item.start,
                end: item.end
            };
        }))
    };
};

// function to read in JSON string from API as returned by convertValueToString
// and convert it back into the value state object

const convertStringToValue = (string) => {
    if (string.length === 0) {
        return [];
    } else {
        const csArray = (JSON.parse(string));
        return csArray.map((item) => {
            return {
                start: item.start,
                end: item.end,
                tag: "ClaimSpan",
                color: COLORS["ClaimSpan"],
            };
        });
    }
};


export default function ClaimSpan({ utterance, setUtterance, classification, isCheckworthy, agent }) {
    const qualifier = "ClaimSpan";
    const [value, setValue] = React.useState([]);
    const [tag, setTag] = React.useState("ClaimSpan");

    const postToAPI = (utt_uuid, qualifier, category, label, agent) => {
        axios.post('/api/classifications/' + utt_uuid + "/", {
            utterance: utt_uuid,
            qualifier,
            category,
            label,
            agent,
        })
            .then((response) => {
                // update the classifications list in the utterance with the new classification received back from the API
                var newClassificationSet = [...utterance.classification_set];
                const classificationIndex = newClassificationSet.findIndex((item) => item.qualifier === qualifier);
                if (classificationIndex !== -1) {
                    newClassificationSet[classificationIndex] = response.data;
                } else {
                    newClassificationSet.push(response.data);
                }
                setUtterance({ ...utterance, classification_set: newClassificationSet });
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            });
    };

    const handleChange = (value) => {
        postToAPI(utterance.uuid, qualifier, value.length > 0 ? qualifier : "", convertValueToString(value), agent);
        setValue(value);
    };

    useEffect(() => {
        setValue(classification?.label.length > 0 ? convertStringToValue(classification.label) : []);
    }, [classification]);

    // if isCheckworthy is false, then delete the claimspan classification and post to the api
    useEffect(() => {
        if (!isCheckworthy && utterance.classification_set.filter((item) => item.category === "Not Checkworthy").length > 0) {
            postToAPI(utterance.uuid, qualifier, "", "", agent);
        }
    }, [isCheckworthy, classification, agent]);

    return (
        <div>
            <TextAnnotate
                style={{
                    fontSize: "1.6rem",
                    textAlign: "left",
                }}
                content={utterance["text"]}
                onChange={isCheckworthy ? handleChange : () => { }}
                value={value}
                getSpan={(span) => ({
                    ...span,
                    tag: tag,
                    color: "rgb(179, 245, 66)",
                })}
            />
        </div>
    );
};