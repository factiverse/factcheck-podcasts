// blue question mark icon help buttons:
// Help for exclusive selector (radio buttons) is located in their data definition in data.js

export const helpModalData = {
    title: "Welcome to this Podcast Annotation Task",
    introduction: "Please take a moment to read through these instructions and guidlines which will help you complete the tasks \
    and ensure your work is accepted. You may refer back to this window at any time by clicking the green \
    <strong> HELP</strong> button in the top left corner of the window.",
    workflowTitle: "How does this work?",
    workflowIntroduction: "You will be presented with a series of statements from this podcast, \
    and for each statement you will have some tasks to complete. Audio from the podcast is available \
    on the integrated media player, and you can use this to listen to the podcast and check the context of the statement.",
    workflowDescriptionCheckworthy: "Determining whether it would even be possible to fact check the statement on the internet with public sources, \
    and if fact checking this statement would be beneficial or interesting for the public.",
    workflowDescriptionTranscribe: "Verififying that the automatically generated transcription is correct, and fixing any errors if not.",
    workflowDescriptionFactcheck: "Carrying out a basic fact check on the statement by making searches with your preferred search engine, \
    selecting documents from the results, and copying and pasting a section from the document which either supports or refutes the statement.",
    workflowDescriptionClaimSpan: "Highlight the part of the statement which you will carry out the fact check on.",
    workflowDescriptionMotivation: "Identify why this statement is import to fact check.",
    workflowDescriptionAdvertising: "Identify whether the statement is advertising or not.",

    politicalTitle: "Is this political?",
    politicalBody: "The podcast content you will be labelling and listening to will often be of a political nature, \
    but the creators of this study are politically neutral. For researchers to build accurate and non-biased AI systems, \
    it is essential to have the input of people with a wide range of views. Whether you agree with the views expressed in \
    this podcast or not, your work here is equally valuable. The key factor is that you remain critical and objective in your labelling. \
    You are free to formulate your own search queries, on your chosen platform, and prioritize evidence documents from sources that you \
    find most trustworthy, but all judgements as to whether the evidence refutes or supports the claim must be based on the content of the \
    evidence document as it presents the facts.",

    healthTitle: "You are assigned a podcast in the category Health & Wellness.",
    healthBody: "You are not required to have any special background knowledge in this area, but we especially appreciate contributions from \
    those who do and will prioritize those with quality work in new studies that will be published regularly. \
    .",

}

export const finalModalData = {
    title: "Finalize your submission and return to Prolific",
    body: [
        "Your responses have passed basic validation and you can now submit your work.",
        "Please take a moment to review your work if you have not already done so, \
    click the <em>Cancel</em> button and cycle back through the statements you have already labelled \
    verifying that you agree with all your answers and they follow the guidlines."
    ]
}

export const helpPopUpData = {
    Factcheck: {
        cardTitle: "Fact Check",
        cardInstructionHeader: "Carry out a basic fact check on the statement.",
        cardInstructionBody: "Here you will search with a search engine and record the search phrase you use \
    (or simply paste the link to the search results page in). You can also add a link to a search engine result. \
    If you find a result that supports the statement, you can add it to the document set. If you find a result that \
    does not support the statement, you can add it to the document set and mark it as false. You can also add a comment to the document.",
        helpHeader: "Carry out a basic fact check on the statement.",
        helpText: "Here you will search with a search engine and record the search phrase you use \
    (or simply paste the link to the search results page in). You can also add a link to a search engine result. \
    If you find a result that supports the statement, you can add it to the document set. If you find a result that \
    does not support the statement, you can add it to the document set and mark it as false. You can also add a comment to the document."
    },
    ClaimSpan: { // this is for the help button that appears on the STATEMENT/UTTERANCE card when isCheckworthy and ClaimSpan must be added by user
        cardTitle: "Statement - Highlight Claim Span",
        cardInstructionHeader: "Highlight the part of the podcast statement above which you will be fact checking.",
        cardInstructionBody: "Here you will highlight the part of the podcast statement that you will be fact checking.",
        helpHeader: "Carry out a basic fact check on the statement.",
        helpText: "Here you will search with a search engine and record the search phrase you use \
    (or simply paste the link to the search results page in). You can also add a link to a search engine result. \
    If you find a result that supports the statement, you can add it to the document set. If you find a result that \
    does not support the statement, you can add it to the document set and mark it as false. You can also add a comment to the document."
    },
    Transcription: {
        cardTitle: "Transcription",
        cardInstructionHeader: "Verify the machine transcription matches the audio.",
        helpHeader: "Transcription Verification",
        helpText: "Verify the accuracy of the transcription. FOCUS ON CORRECTING WORDS THAT ARE CLEARLY WRONG after listening to the audio. \
        This is a non-verbatim transcription, so filler words such as \"um,\" \"uh,\" \"like,\" \"so,\" and \"you know.\", \
        repeated words, stutters, and false starts are often left out, DO NOT ADD THESE., click \"Edit\" to make changes \
        followed by \"Approve Edit\" to confirm them, \"Rest\" deletes your previous input."
    },
    Diarization: {
        cardTitle: "Diarization",
        cardInstructionHeader: "Enter the full name of the speaker.",
        helpHeader: "Diarization",
        helpText: "Identify the correct speaker for the statement. If the speaker is not listed, select \"Other\" and type the speaker's name."
    },
    FinalSubmission: {
        helpHeader: "Final submission after completion of all tasks.",
        helpText: "Complete each individual task card for the podcast statement to receive a green checkmark and \
        advance to the next statement. After all statements have a green check mark, and the minimum number of \
        fact checks queries and evidence are submitted, this button will be activated to finalize and return to Prolific."
    },
};
