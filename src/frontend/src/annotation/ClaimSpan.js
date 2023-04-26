import React, { useEffect} from 'react';
import { TextAnnotate } from "react-text-annotate-blend"

export default function ClaimSpan({ utterance }) {
    const [value, setValue] = React.useState([{
        "start": utterance.claimspan[0],
        "end": utterance.claimspan[1],
        "text": utterance["text"].substring(utterance.claimspan[0], utterance.claimspan[1]),
        "tag": "ClaimSpan",
        "color": "rgb(179, 245, 66)"
    }]);
    const [tag, setTag] = React.useState("ClaimSpan");

    useEffect(() => {
        setValue([
          {
            start: utterance.claimspan[0],
            end: utterance.claimspan[1],
            text: utterance['text'].substring(utterance.claimspan[0], utterance.claimspan[1]),
            tag: 'ClaimSpan',
            color: 'rgb(179, 245, 66)',
          },
        ]);
      }, [utterance]);

    const handleChange = (value) => {
        setValue(value);
    };

    const COLORS = {
        ClaimSpan: "rgb(179, 245, 66)",
        tagB: "#42f5f5",
        tagC: "#4b46cd",
    };

    return (
        <>
            <div>
                <TextAnnotate
                    style={{
                        fontSize: "1.2rem",
                    }}
                    content={utterance["text"]}
                    onChange={handleChange}
                    value={value}
                    getSpan={(span) => ({
                        ...span,
                        tag: tag,
                        color: COLORS[tag],
                    })}
                />
            </div>

            {/*
        <selector value = {tag} handler={(e) => setTag(e.target.value)}/>
        
        <h3>Current Stored Value</h3>

        <div>
            <pre>{JSON.stringify(value, null, 2)}</pre>
        </div>
        */}
        </>
    );
};