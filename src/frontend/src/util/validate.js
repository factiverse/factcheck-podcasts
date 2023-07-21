import { allQualifiers } from "../annotation/data";

export function validateAnnotations(segmentation, minFactChecks, minDocs, single = false, singleQual = null, multiDiarize=false) {

    const isClassificationMissing = (qual, classification_set) =>
        classification_set.filter((item) => item.qualifier === qual).length === 0 ||
        classification_set.filter((item) => item.category).length === 0;

    const checkForMissingDocuments = (query) => {
        if (query.document_set.length < 1) {
            return false;
        }
        let docCount = 0;
        for (let l = 0; l < query.document_set.length; l++) {
            const doc = query.document_set[l];
            if (doc.valid) {
                docCount++;
            }
        }
        return docCount;
    };

    function isValidURL(str) {
        try {
            new URL(str);
            return true;
        } catch (e) {
            return false;
        }
    }

    let queryCount = 0;
    let docCount = 0;
    let complete = true;
    let errorTxt = "";
    if (segmentation.utterance_set) {
        let i = 0;
        let totDone = 0;
        let qualifiers = null;
        let completed = 0;
        for (const utterance of segmentation.utterance_set) {
            i++;
            if (singleQual) {
                qualifiers = [singleQual];
            } else {
                qualifiers = utterance.visibility === 1 ? allQualifiers : utterance.visibility;
            }
            for (const qual of qualifiers) {

                if (qual !== "Factcheck" && qual !== "ClaimSpan" && qual !== "Diarization" && qual !== "Motivation" && isClassificationMissing(qual, utterance.classification_set)) {
                    errorTxt += `MISSING: ${qual}, on STATEMENT: ${i}\n`;
                    totDone +=1;
                    complete = false;
                } else if (qual === "Diarization" && segmentation.agent_session?.diarization) {
                    for (const [key, value] of Object.entries(segmentation.agent_session?.diarization)) {
                        if (value.length === 0) {
                            if (!multiDiarize && single) {
                                errorTxt += `MISSING: DIARIZATION for ${key} on STATEMENT: ${i}\n`;
                                complete = false;
                            }
                        }
                    }


                } else if ((qual === "Factcheck" || qual === "ClaimSpan" || qual === "Motivation") && !isClassificationMissing("Checkworthiness", utterance.classification_set.filter((item) => item.category === "Checkable"))) {
                    if (qual === "ClaimSpan" && isClassificationMissing("ClaimSpan", utterance.classification_set)) {
                        errorTxt += `MISSING: CLAIMSPAN, on STATEMENT: ${i}\n`;
                        complete = false;
                    } else if (qual === "Factcheck" && utterance.query_set.length < 1) {
                        errorTxt += `MISSING: Factcheck, on STATEMENT: ${i}\n`;
                        complete = false;
                    } else if (qual === "Motivation" && isClassificationMissing("Motivation", utterance.classification_set)) {
                        errorTxt += `MISSING: Factcheck, on STATEMENT: ${i}\n`;
                        complete = false;
                    } else {
                        let j = 0;
                        for (const query of utterance.query_set) {
                            j++;
                            if (query.valid) {
                                queryCount++;
                            } else {
                                errorTxt += `MISSING: Factcheck QUERY, on STATEMENT: ${i}\n`;
                                complete = false;
                            }
                            const queryDocCount = checkForMissingDocuments(query);
                            if (!queryDocCount) {
                                errorTxt += `MISSING: Factcheck EVIDENCE, on STATEMENT: ${i}\n`;
                                complete = false;
                            } else {
                                docCount += queryDocCount;
                                // check if any two query documents have the exact same URL and text
                                // if so, mark the second one as invalid
                                // or if any of the query documents is not a valid URL
                                for (let l = 0; l < query.document_set.length; l++) {
                                    const doc = query.document_set[l];
                                    if (!isValidURL(doc.document)) {
                                        errorTxt += `INVALID: Factcheck EVIDENCE not a URL, on STATEMENT: ${i}, QUERY: ${j}, EVIDENCE: ${l + 1}\n`;
                                        complete = false;
                                    }
                                    for (let m = l + 1; m < query.document_set.length; m++) {
                                        const doc2 = query.document_set[m];
                                        if (doc.document === doc2.document && doc.comment === doc2.comment) {
                                            errorTxt += `DUPLICATE: Factcheck EVIDENCE, on STATEMENT: ${i}\n`;
                                            complete = false;
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    completed = i-totDone;
                    if (completed >= 25) {
                        complete = true;
                    }
                }
            }
            
        }
        if (segmentation.agent_session?.diarization) {
            for (const [key, value] of Object.entries(segmentation.agent_session.diarization)) {
                if (value.length < 2 && !single) {
                    if (multiDiarize) {
                        errorTxt += `MISSING: SPEAKER NAME, for: ${key}\n`;
                        complete = false;
                    }
                } 
            }
        }


        if (!single && qualifiers.includes("Factcheck")) {
            if (queryCount < minFactChecks) {
                complete = false;
                errorTxt += `MISSING: Factcheck QUERY, ${queryCount}/${minFactChecks} across ALL STATEMENTS\n`;
            }
            if (docCount < minDocs) {
                complete = false;
                errorTxt += `MISSING: Factcheck EVIDENCE, ${docCount}/${minDocs} across ALL STATEMENTS\n`;
            }
        }
    }

    return { complete, errorTxt };
}           