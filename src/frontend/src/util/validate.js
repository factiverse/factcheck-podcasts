import { allQualifiers } from "../annotation/data";

export function validateAnnotations(segmentation, minFactChecks, minDocs, single = false) {

    const isClassificationMissing = (qual, classification_set) =>
        classification_set.filter((item) => item.qualifier == qual).length === 0 ||
        classification_set.filter((item) => item.qualifier == qual)[0].label == "[]" || //empty ClaimSpan
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

    let queryCount = 0;
    let docCount = 0;
    let complete = true;
    let errorTxt = "";

    if (segmentation.utterance_set) {
        let i = 0;
        for (const utterance of segmentation.utterance_set) {
            i++;
            const qualifiers = utterance.visibility === 1 ? allQualifiers : utterance.visibility;

            for (const qual of qualifiers) {
                if (qual !== "Factcheck" && isClassificationMissing(qual, utterance.classification_set)) {
                    errorTxt += `MISSING: ${qual}, on STATEMENT: ${i}\n`;
                    complete = false;
                } else if (qual === "Factcheck" && !isClassificationMissing("Checkworthiness", utterance.classification_set.filter((item) => item.category === "Checkworthy"))) {
                    if (utterance.query_set.length < 1) {
                        errorTxt += `MISSING: Factcheck, on STATEMENT: ${i}\n`;
                        complete = false;
                    } else {
                        for (const query of utterance.query_set) {
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
                            }
                        }
                    }
                }
            }
        }
        if (!single) {
            if (queryCount < minFactChecks) {
                complete = false;
                errorTxt += `MISSING: Factcheck QUERY, ${queryCount}/${minFactChecks} across ALL STATEMENTS\n`;
            }
            if (docCount < minDocs) {
                complete = false;
                errorTxt += `MISSING: Factcheck EVIDENCE, ${docCount}/${minDocs} across ALL STATEMENTS\n`;
            }
        }
        return { complete, errorTxt };

    }
}