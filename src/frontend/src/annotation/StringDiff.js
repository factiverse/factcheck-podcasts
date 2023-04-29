import React from 'react';
import { Badge } from 'react-bootstrap';
// when the words are not equal, keep collecting new words from stringB until you find a match for the string after the current word in stringA
// then at that point push the collected words from stringB into differences as a removed type and push the word from stringA into differences as an added type
// if you reach the end of stringA or stringB before finding a match then collect another word from stringA and repeat the process
const findOverlappingWords = (stringA, stringB) => {
    //split on whitespace 
    const wordsText = stringA.split(/\s+/);
    const wordsCoref = stringB.split(/\s+/);
    console.log(wordsText, wordsCoref)
    const differences = [];
    let i = 0;
    let j = 0;

    while (i < wordsText.length && j < wordsCoref.length) {
        if (wordsText[i] === wordsCoref[j]) {
            differences.push({
                type: 'common',
                value: wordsText[i] + ' ',
            });
            i++;
            j++;
        } else {
            let nextAnchor = wordsText[i + 1];
            let textWords = [wordsText[i]];
            let corefWords = [];
            while (wordsCoref[j] !== nextAnchor && j < wordsCoref.length) {
                corefWords.push(wordsCoref[j]);
                j++;
                if (j >= wordsCoref.length && i < wordsText.length - 2) {
                    textWords.push(wordsText[i + 2]);
                    nextAnchor = textWords.join(' ');
                    j = i;
                    i++;
                    console.log("spin out")
                }
            }
            if (corefWords.length > 0) {
                differences.push({
                    type: 'removed',
                    value: textWords.join(' '),
                });
                differences.push({
                    type: 'added',
                    value: corefWords.join(' '),
                });
            } else {
                //differences.push({
                //    type: 'common',
                //    value: textWords.join(' '),
                //});
            }
            i++;
            console.log(i, j)
        }
    }
    console.log(differences)
    return differences;
};


const StringDiff = ({ stringA, stringB }) => {
    const differences = findOverlappingWords(stringA, stringB);

    return (
        <div>
            {differences.map((part, index) => (
                <span key={index}>
                    {part.type === 'common' ? (
                        <span>{part.value}</span>
                    ) : (
                        <Badge
                            bg={part.type === 'added' ? 'success' : 'danger'}
                            className="mx-1"
                        >
                            {part.value}
                        </Badge>
                    )}
                </span>
            ))}
        </div>
    );
};

export default StringDiff;
