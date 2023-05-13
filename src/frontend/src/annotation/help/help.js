// blue question mark icon help buttons:
// Help for exclusive selector (radio buttons) is located in their data definition in data.js

import { circleStyle } from "./CircleFirstLetter";

export const helpModalData = {
    title: "Welcome to this Podcast Annotation Task",
    introduction: "Please take a moment to read through these instructions and guidelines which will help you complete the tasks \
    and ensure your work is accepted. You may refer back to this window at any time by clicking the <span style='background-color:green; color:white; display:inline-flex; justify-content:center; \
    align-items:center; border-radius:3px;'>&nbspHELP&nbsp</span> \
    button in the top left corner of the window.",
    workflowTitle: "How does this work?",
    workflowIntroduction: "<p>For each statement from the podcast that is assigned you will be presented with a page containing different cards. \
    The main <strong>Statement</strong> card is where you will view the current statement you are to focus on, this \
    card also contains a list of previous statements to provide context, and a section showing results from an \
    automated pronoun resolution model which can provide helpful context but be aware that is not 100% reliable. \
    Finally, the statement card contains an audio player loaded with the podcast audio, you may click the \
    <span style='background-color:green; text-shadow: 0 0 0 white; color:white; display:inline-flex; justify-content:center; align-items:center; border-radius:50%; width:20px; height:20px;'>▷</span>    \
    buttons to jump to a specific statement in the audio. When you move to a new statement the media player will \
    automatically be set to this statement's start time. It is possible to adjust the speed of the audio playback as needed, \
    it can be slowed for difficult to understand statements or sped up for slow speech. How this is set depends on your browser, \
    find a menu button or try right clicking on the media player.</p> \
    \
    <p>For each card on a statement you must complete, an <strong style='color:red; font-size:1.2rem'>X</strong> will be displayed while the card is incomplete or \
    fails validation, an <strong style='color:orange; font-size:1.2rem'>X</strong> shows the card is incomplete but can be completed over multiple statements, \
    and a <strong style='color:green; font-size:1.2rem'>✓</strong> is shown when the card is complete and has passed a basic validation. After you have received a \
    <strong style='color:green; font-size:1.2rem'>✓</strong> on all cards you will receive a <strong style='color:green; font-size:1.2rem'>✓</strong> for the statement as a whole \
    (shown next to the navigation buttons) and are free to move to the next statement.</p> \
    \
    <p> To navigate between statements use the buttons on the top center of the screen, the \
    corresponding arrow keys on your keyboard, or on a touch screen you can swipe between statements. Each card has a \
    <strong style='font-size: 0.8rem; background-color:blue; color:white; display:inline-flex; justify-content:center; \
    align-items:center; border-radius:5px;'>&nbsp&nbsp?&nbsp&nbsp</strong> button which will provide more detailed instructions \
    for that card and hovering your mouse cursor over buttons on the cards will show a more detailed description for that button.\
    <span class='me-0 mt-0 pt-0' style='border:1px solid; border-radius:50%; width:20px; height:20px; display:inline-flex; justify-content:center; align-items:center'>B</span>uttons \
    where the first letter is surrounded by a circle may be activated by pressing that letter on your keyboard as a shortcut. </p> \
    \
    <p>After you have received a <strong style='color:green; font-size:1.2rem'>✓</strong> for all cards contained on all statements, and completed \
    the mandatory minimum number of certain tasks that require this, the <strong>Final Submission</strong> button in the upper right hand \
    corner of your screen will be activated and turn green. When you are complete you must click this button and confirm you are finished \
    before being automatically redirected back to Prolific. The <strong style='font-size: 0.8rem; background-color:blue; color:white; \
    display:inline-flex; justify-content:center; align-items:center; border-radius:5px;'>&nbsp&nbsp?&nbsp&nbsp</strong>    \
    button to the left of the Final Submission button will give you an overview of missing tasks and which statements have errors.</p>",

    workflowDescriptionCheckworthy: "<strong>Checkworthiness:</strong> Determining whether it would even be possible to fact check the statement on the internet with public sources, \
    and if fact checking this statement would be beneficial or interesting for the public.",
    workflowDescriptionTranscribe: "<strong>Transcription Verification:</strong> Verifying that the automatically generated transcription is correct, and fixing any errors if not.",
    workflowDescriptionFactcheck: "<strong>Fact Check:</strong> Carrying out a basic fact check on the statement by making searches with your preferred search engine, \
    selecting documents from the results and copying and pasting a section from the document which either supports or refutes the statement.",
    workflowDescriptionClaimSpan: "<strong>Highlight Claim:</strong> Highlight the part of the statement which you will carry out the fact check on.",
    workflowDescriptionMotivation: "<strong>Motivation:</strong> Identify why this statement is import to fact check.",
    workflowDescriptionAdvertising: "<strong>Advertising:</strong> Identify whether the statement is advertising or not.",
    workflowDescriptionDiarization: "<strong>Speaker Identification:</strong> Identify and type the full name of the speaker.",

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
    closingTitle: "Thank you for your time!",
    closingBody: "We hope you enjoy the task and find the compensation fair. If you have any questions or feedback, please do not hesitate to \
    contact us here on Prolific. We will be publishing a range of studies with different podcasts and tasks soon, including bonus \
    opportunities for those with the most accurate work, so please check back regularly and watch for invites to new studies." 
}

export const finalModalData = {
    title: "Finalize your submission and return to Prolific",
    body: [
        "Your responses have passed basic validation and you can now submit your work.",
        "Please take a moment to review your work if you have not already done so, \
    click the <strong>Cancel</strong> button and cycle back through the statements you have already labelled \
    verifying that you agree with all your answers, and they follow the guidlines."
    ],
    feedbackTitle: "If you have any final comments or feedback, please enter them here:",
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
        helpText: "Verify the accuracy of the transcription. <strong>focus on fixing words that have been incorrectly transcribed</strong> \
        after listening to the audio. \n This is a non-verbatim transcription, so filler words such as \"um,\" \"uh,\" \"like,\" \"so,\" and \"you know.\", \
        repeated words, stutters, and false starts are often left out, <strong>do not add these words</strong>. \n If the transcription is correct, \
        click <strong>Approve</strong>.\n If the transcription is incorrect, click <strong>Edit</strong> to make changes followed by <strong>Approve Edit</strong> to confirm them. \n \
        If you are unable to understand the speech, click <strong>Unsure</strong>. \nIf you have made a mistake, click <strong>Reset</strong> to revert your changes."
    },
    Diarization: {
        cardTitle: "Speaker Identification",
        cardInstructionHeader: "Enter the full name for each of the machine-detected speakers.",
        helpHeader: "Identifying the Speakers",
        helpText: "Unlike other cards, the speaker identification card will remain unchanged as you advance from statement to statement. \
        It is your job to identify the full name of all speakers before you before completing this study.\n You will use the context of the \
        podcast to identify the speakers, including the episode and podcast titles visible at the top of the page and the details given on the \
        <strong>Podcast Details</strong> tab of the <strong style='background-color:green; color:white'>&nbspHELP&nbsp</strong> page.\n \
        You may also use the podcast website, or other public sources, to identify the speakers. If the speaker is not identified, and only speaks briefly, \
        for example, in advertisements, you may enter <strong>UNKNOWN</strong>.\n The speakers for each statement have been automatically detected, and therefore may \
        not be completely accurate.\n You may enter the name of a single speaker twice if you believe the speaker has been incorrectly identified as two \
        different people.\n If you believe two different people have been identified as a single speaker, enter the name of the person who has spoken most. "
    },
    FinalSubmission: {
        helpHeader: "Final submission after completion of all tasks.",
        helpText: "Complete each individual task card for the podcast statement to receive a green checkmark and \
        advance to the next statement. After all statements have a green check mark, and the minimum number of \
        fact checks queries and evidence are submitted, this button will be activated to finalize and return to Prolific."
    },
};



