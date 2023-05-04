import React, { useEffect } from 'react';
import { TextAnnotate } from "react-text-annotate-blend"

export default function ClaimSpan({ utterance }) {
    const [value, setValue] = React.useState([]);
    const [tag, setTag] = React.useState("ClaimSpan");

    //useEffect(() => {
    //    setValue([
    //      {
    //        start: 0,
    //        end: utterance.length,
    //        text: utterance["text"],
    //        tag: "ClaimSpan",
    //        color: "rgb(179, 245, 66)"
    //      },
    //    ]);
    //  }, [utterance]);

    const handleChange = (value) => {
        setValue(value);
    };

    const COLORS = {
        ClaimSpan: "rgb(179, 245, 66)",
    };

    return (
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
                    color: "rgb(179, 245, 66)",
                })}
            />
        </div>
    );
};