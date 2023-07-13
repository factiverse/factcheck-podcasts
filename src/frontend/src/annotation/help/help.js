// blue question mark icon help buttons:
// Help for exclusive selector (radio buttons) is in their data definition in data.js
export const helpModalData = {
    // new version which is meant to be less wordy and more concise, also more tailored to transcription, identifying speakers and advertising
    FV_CW: {
        title: "Welcome to this Podcast Annotation Task",
        introduction: "Please take a moment to read through these instructions and guidelines which will help you complete the tasks \
    and ensure your work is accepted. You may refer back to this window at any time by clicking the <span style='background-color:green; \
    color:white; display:inline-flex; justify-content:center; align-items:center; border-radius:3px;'>&nbspHELP&nbsp</span> \
    button in the top left corner of the window.",
        workflowTitle: "What do I need to do?",
        workflowIntroduction: "<p>The podcast has been automatically transcribed and split into sentences (statements). \
        <strong>You will go through each statement in the podcast and make a decision about whether it warrants a fact check \
        <em>('Checkworthiness')</em>.</strong></p> \
        \
        <p>After you classify a statement in a <em>Checkable</em> category, an additional <strong>Motivation</strong> card will be shown where you are asked \
        for your opinion about why carrying out a fact check might be beneficial. You may also optionally highlight the section of the text which contains \
        the claim you are considering on the <em>Statement</em> card.</p> \
        \
        <p><strong>Factiverse:</strong> Your responses are recorded as you advance from statement to statement. The information about validation below is \
        primary for crowdsourcing workers, it is not necessary to activate and click the <em>Final Submission</em> button to save your answers. </p>\
        \
        <h5>How does this work?</h5> \
        <p> Each card for the required tasks will have a <strong style='font-size: 0.8rem; background-color:blue; color:white; \
        display:inline-flex; justify-content:center; align-items:center; border-radius:5px;'>&nbsp&nbsp?&nbsp&nbsp</strong> button \
        which will provide more detailed instructions for that card. <strong>You must click the <strong style='font-size: 0.8rem; \
        background-color:blue; color:white; display:inline-flex; justify-content:center; align-items:center; border-radius:5px;'\
        >&nbsp&nbsp?&nbsp&nbsp</strong> button and read the instructions completely before completing any task type for the first time.</strong> \
        </p> \
        \
        <p>When you are ready to begin, click the first <span style='background-color:green; text-shadow: 0 0 0 white; color:white; display:inline-flex; \
        justify-content:center; align-items:center; border-radius:50%; width:20px; height:20px;'>▷</span> button on the \
        <em>Statement</em> card. Underneath this section, you can also see a list of the previous statements to give you more context.\
        The audio player is loaded with the podcast audio, press any <span style='background-color:green; text-shadow: 0 0 0 white; color:white; display:inline-flex; \
        justify-content:center; align-items:center; border-radius:50%; width:20px; height:20px;'>▷</span> button to play that statement. \
        Replay the current statement by pressing the <em>Enter</em> key on your keyboard.</p>\
        \
        <p>To go to the next statement, press the ➡️ key on your keyboard, and the ⬅️ key will take you to the previous statement. \
        You can also click the corresponding buttons in the top center of the screen, or swipe on touch devices. \
        ⬆️ takes you to the first statement, and ⬇️ to the last statement you have already worked on.\
        </p> \
        \
        <p><span class='me-0 mt-0 pt-0' style='border:1px solid; border-radius:50%; width:20px; height:20px; display:inline-flex; \
        justify-content:center; align-items:center'>B</span>uttons \
        where the first letter is surrounded by a circle may be activated by pressing that letter on your keyboard as a shortcut. \
        If you are navigating the task with your keyboard, you may tab between fields and select the highlighted buttons with your space bar. \
        Hovering your mouse over a specific button will show more information about that task including examples.\
        </p> \
        <p>For each card you see, a <strong style='color:red; font-size:1.2rem'>X</strong> will be displayed while the card is incomplete or \
        fails validation, an <strong style='color:orange; font-size:1.2rem'>X</strong> shows the card is incomplete but can be filled in over \
        the course of the whole podcast, and a <strong style='color:green; font-size:1.2rem'>✓</strong> is shown when the card is \
        complete and has passed a basic validation. After you have received a <strong style='color:green; font-size:1.2rem'>✓</strong> \
        on all cards you will receive a <strong style='color:green; font-size:1.2rem'>✓</strong> for the statement (shown next \
        to the navigation buttons).\
        <p>After you have received a <strong style='color:green; font-size:1.2rem'>✓</strong> on all statements, the \
        <strong>Final Submission</strong> button will be unlocked and turn green. This button will allow you to submit your work and be redirected \
        back to Prolific. The <strong style='font-size: 0.8rem; background-color:blue; color:white; display:inline-flex; justify-content:center; \
        align-items:center; border-radius:5px;'>&nbsp&nbsp?&nbsp&nbsp</strong> button to the left of the <em>Final Submission</em> button will give \
        you an <strong>overview of missing tasks and statements which have errors</strong>. Your work is automatically saved as you progress from \
        statement to statement. </p>",

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

    },


    new: {
        title: "Welcome to this Podcast Annotation Task",
        introduction: "Please take a moment to read through these instructions and guidelines which will help you complete the tasks \
    and ensure your work is accepted. You may refer back to this window at any time by clicking the <span style='background-color:green; \
    color:white; display:inline-flex; justify-content:center; align-items:center; border-radius:3px;'>&nbspHELP&nbsp</span> \
    button in the top left corner of the window.",
        workflowTitle: "What do I need to do?",
        workflowIntroduction: "<p>The podcast has been automatically transcribed and split into sentences (statements). \
        You must go through all statements verifying that the machine transcription is faithful to the audio and identify \
        any statements you think could be different types of advertising.</p> \
        \
        <p>We have attempted to identify the different speakers in the podcast using AI tools, but this only \
        produces a label like <em>SPEAKER_08</em> or <em>SPEAKER_01</em>. Over the course of the entire podcast, we need you to try to find \
        the actual public name of the speaker that matches the machine generated label. For example: <br>\
        <span style='background-color:lightgrey;'>SPEAKER_08 = “Joe Biden”</span><br>\
        <span style='background-color:lightgrey;'>SPEAKER_01 = “Donald Trump”</span><br>\
        People introducing themselves and others during the podcast will be your main source of information for this task, \
        along with your background knowledge and the podcast/episode information and details that are shown on the help page.</p> \
        \
        <h5>How does this work?</h5> \
        <p> Each card for the required tasks will have a <strong style='font-size: 0.8rem; background-color:blue; color:white; \
        display:inline-flex; justify-content:center; align-items:center; border-radius:5px;'>&nbsp&nbsp?&nbsp&nbsp</strong> button \
        which will provide more detailed instructions for that card. <strong>You must click the <strong style='font-size: 0.8rem; \
        background-color:blue; color:white; display:inline-flex; justify-content:center; align-items:center; border-radius:5px;'\
        >&nbsp&nbsp?&nbsp&nbsp</strong> button and read the instructions completely before completing any task type for the first time.</strong> \
        </p> \
        \
        <p>When you are ready to begin, click the first <span style='background-color:green; text-shadow: 0 0 0 white; color:white; display:inline-flex; \
        justify-content:center; align-items:center; border-radius:50%; width:20px; height:20px;'>▷</span> button on the \
        <em>Statement</em> card. Underneath this section, you can also see a list of the previous statements to give you more context.\
        The audio player is loaded with the podcast audio, press any <span style='background-color:green; text-shadow: 0 0 0 white; color:white; display:inline-flex; \
        justify-content:center; align-items:center; border-radius:50%; width:20px; height:20px;'>▷</span> button to play that statement. \
        Replay the current statement by pressing the <em>Enter</em> key on your keyboard.</p>\
        \
        <p>To go to the next statement, press the ➡️ key on your keyboard, and the ⬅️ key will take you to the previous statement. \
        You can also click the corresponding buttons in the top center of the screen, or swipe on touch devices. \
        ⬆️ takes you to the first statement, and ⬇️ to the last statement you have already worked on.\
        </p> \
        \
        <p><span class='me-0 mt-0 pt-0' style='border:1px solid; border-radius:50%; width:20px; height:20px; display:inline-flex; \
        justify-content:center; align-items:center'>B</span>uttons \
        where the first letter is surrounded by a circle may be activated by pressing that letter on your keyboard as a shortcut. \
        If you are navigating the task with your keyboard, you may tab between fields and select the highlighted buttons with your space bar. \
        Hovering your mouse over a specific button will show more information about that task including examples.\
        </p> \
        <p>For each card you see, a <strong style='color:red; font-size:1.2rem'>X</strong> will be displayed while the card is incomplete or \
        fails validation, an <strong style='color:orange; font-size:1.2rem'>X</strong> shows the card is incomplete but can be filled in over \
        the course of the whole podcast, and a <strong style='color:green; font-size:1.2rem'>✓</strong> is shown when the card is \
        complete and has passed a basic validation. After you have received a <strong style='color:green; font-size:1.2rem'>✓</strong> \
        on all cards you will receive a <strong style='color:green; font-size:1.2rem'>✓</strong> for the statement (shown next \
        to the navigation buttons).\
        <p>After you have received a <strong style='color:green; font-size:1.2rem'>✓</strong> on all statements, the \
        <strong>Final Submission</strong> button will be unlocked and turn green. This button will allow you to submit your work and be redirected \
        back to Prolific. The <strong style='font-size: 0.8rem; background-color:blue; color:white; display:inline-flex; justify-content:center; \
        align-items:center; border-radius:5px;'>&nbsp&nbsp?&nbsp&nbsp</strong> button to the left of the <em>Final Submission</em> button will give \
        you an <strong>overview of missing tasks and statements which have errors</strong>. Your work is automatically saved as you progress from \
        statement to statement. </p>",

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

    },


    original: {
        title: "Welcome to this Podcast Annotation Task",
        introduction: "Please take a moment to read through these instructions and guidelines which will help you complete the tasks \
    and ensure your work is accepted. You may refer back to this window at any time by clicking the <span style='background-color:green; color:white; display:inline-flex; justify-content:center; \
    align-items:center; border-radius:3px;'>&nbspHELP&nbsp</span> \
    button in the top left corner of the window.",
        workflowTitle: "How does this work?",
        workflowIntroduction: "<p>For each sentence from the podcast that is assigned you will be presented with a page containing different cards. \
    On this page, the main <strong>Statement</strong> card is where you will view the text for the current sentence you are to focus on. This \
    card also contains a list of previous sentences to provide context, and a section showing results from an \
    automated pronoun resolution model which can provide helpful context but is not 100% reliable. </p> \
    <p> \
    The <strong>Statement</strong> card contains an audio player loaded with the podcast audio; you may click the \
    <span style='background-color:green; text-shadow: 0 0 0 white; color:white; display:inline-flex; justify-content:center; align-items:center; border-radius:50%; width:20px; height:20px;'>▷</span>    \
    buttons to jump to a specific statement in the audio. When you move to a new statement the media player will \
    automatically be set to this statement's start time. It is possible to adjust the speed of the audio playback as needed, \
    it can be slowed for difficult to understand statements or sped up for slow speech. How this is set depends on your browser, \
    find a menu button or try right clicking on the media player.</p> \
    \
    <p> To navigate between statements use the buttons on the top center of the screen, the \
    corresponding arrow keys on your keyboard, or on a touch screen you can swipe between statements. Each card has a \
    <strong style='font-size: 0.8rem; background-color:blue; color:white; display:inline-flex; justify-content:center; \
    align-items:center; border-radius:5px;'>&nbsp&nbsp?&nbsp&nbsp</strong> button which will provide more detailed instructions \
    for that card and hovering your mouse cursor over buttons on the cards will show a more detailed description for that button.\
    <strong>You must click the  <strong style='font-size: 0.8rem; background-color:blue; color:white; display:inline-flex; justify-content:center; \
    align-items:center; border-radius:5px;'>&nbsp&nbsp?&nbsp&nbsp</strong> button and read the instructions completely before completing any task type \
    for the first time.</strong> </p> \
    \
    <p><span class='me-0 mt-0 pt-0' style='border:1px solid; border-radius:50%; width:20px; height:20px; display:inline-flex; \
    justify-content:center; align-items:center'>B</span>uttons \
    where the first letter is surrounded by a circle may be activated by pressing that letter on your keyboard as a shortcut. \
    if you are navigating the task with your keyboard, you may tab between fields and select the highlighted buttons with your space bar.\
    The audio player can be manually started or stopped by pressing the <em>Enter</em> key on your keyboard. Several audio player keyboard \
    shortcuts are available for advanced users: Shift+PlusKey increases audio speed, Shift+MinusKey decreases audio speed, Shift+RightArrowKey \
    scrubs(skips) audio forward, and Shift+LeftArrowKey scrubs audio backwards. \
    </p> \
    \
    <p>For each card you are assigned to complete, an <strong style='color:red; font-size:1.2rem'>X</strong> will be displayed while the card is incomplete or \
    fails validation, an <strong style='color:orange; font-size:1.2rem'>X</strong> shows the card is incomplete but can be completed over multiple statements, \
    and a <strong style='color:green; font-size:1.2rem'>✓</strong> is shown when the card is complete and has passed a basic validation. After you have received a \
    <strong style='color:green; font-size:1.2rem'>✓</strong> on all cards you will receive a <strong style='color:green; font-size:1.2rem'>✓</strong> for the statement as a whole \
    (shown next to the navigation buttons) and are free to move to the next statement.</p> \
    \
    <p>After you have received a <strong style='color:green; font-size:1.2rem'>✓</strong> for all cards contained on all statements, and completed \
    the mandatory minimum number of certain tasks that require this, the <strong>Final Submission</strong> button in the upper right hand \
    corner of your screen will be activated and turn green. When you are complete you must click this button and confirm you are finished \
    before being automatically redirected back to Prolific. The <strong style='font-size: 0.8rem; background-color:blue; color:white; \
    display:inline-flex; justify-content:center; align-items:center; border-radius:5px;'>&nbsp&nbsp?&nbsp&nbsp</strong>    \
    button to the left of the <em>Final Submission</em> button will give you an <strong>overview of missing tasks and which statements have errors</strong>.</p>",

        workflowDescriptionCheckable: "<strong>Checkworthiness:</strong> Determining whether it would even be possible to fact check the statement on the internet with public sources, \
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
    contact us here on Prolific or leave a comment in the field shown before finalizing your submission. We will be publishing a range of studies \
    with different podcasts and tasks soon, including bonus opportunities for those with the most accurate work, so please check back regularly and \
    watch for invites to new studies."
    }
}
export const finalModalData = {
    title: "Finalize your submission and return to Prolific",
    body: [
        "Your responses have passed basic validation and you can now submit your work.",
        "Please take a moment to review your work if you have not already done so, \
    click the <strong>Cancel</strong> button and cycle back through the statements you have already labelled \
    verifying that you agree with all your answers, and they follow the guidelines."
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
    ClaimSpan: { // this is for the help button that appears on the STATEMENT/UTTERANCE card when isCheckable and ClaimSpan must be added by user
        cardTitle: "Statement - Highlight Claim Span",
        //cardInstructionHeader: "",
        //cardInstructionBody: "",
        helpHeader: "Highlight the part of the podcast statement above which you will be fact checking.",
        helpText: "Here you will highlight the part of the podcast statement that you will be fact checking."
    },
    Transcription: {
        cardTitle: "Transcription",
        cardInstructionHeader: "Verify machine transcription matches the audio.",
        cardInstructionBody: "<strong>Focus on fixing individual words</strong> that have been incorrectly transcribed. \
        <strong>This is a non-verbatim transcription</strong>, so filler words such as \"um,\" \"uh,\" \"like,\" \"so,\" and \"you know.\", \
        repeated words, stutters, and false starts are often left out, <strong>do not add or remove these words</strong>. \
        Choose <strong>Unsure</strong> if the audio is in a <strong>foreign language</strong> that you do not understand.",
        helpHeader: "Transcription Verification",
        helpText: "It is important all words in the audio which have any effect on the statement's meaning are included. \
        Do not add or remove filler words from the transcription if they do not directly impact how the statement would be understood. \
        Focus most on words that are transcribed wrong, for example 'and' mistaken for 'in' during rapid speech. \
        <strong>If two people are talking at the same time</strong>, focus on the speech of only one of them, the one who you consider louder \
        or more dominating. \n If the transcription is acceptable, select <strong>Approve Original</strong>.\n If the transcription is incorrect, \
        select <strong>Edit</strong> to make changes followed by <strong>Confirm Edit</strong> to approve them. \n \
        If you are unable to understand the speech, including foreign languages, select <strong>Unsure</strong>. \n \
        If you have made a mistake, click <strong>Reset</strong> to revert your changes. \n <strong>Foreign language</strong> you do not understand \
        should be marked as unsure and is usually <em>External Advertising</em> spliced in (this podcast audio was downloaded outside of the US). \n \
        <strong>Audio Alignment</strong> is adjusted so that the statements should have a small (0.3sec) overlap, do not add words already in a \
        neighboring statement."
    },
    Diarization: {
        cardTitle: "Speaker Identification",
        cardInstructionHeader: "Enter the name of each of the machine-detected speakers.",
        cardInstructionBody: "This card is completed over the course of the entire podcast, enter the full public or stage name of the speaker.\
        You can see the machine identified speakers in the <em>Statement</em> card to the right of the start and end times.",
        helpHeader: "Identifying the Speakers",
        helpText: "Unlike other cards, the speaker identification card will remain unchanged as you advance from statement to statement. \
        It is your job to identify the full name of all speakers before completing this study.\n You will use what you hear in the \
        podcast to identify the speakers' names, along with the additional information about the assigned podcast that is given on the \
        <strong>Podcast Details</strong> tab of the <strong style='background-color:green; color:white'>&nbspHELP&nbsp</strong> page.\n \
        You may also use the podcast website, or other public sources, to identify the speakers.\n <strong>If you are not able to determine the identity of the speaker</strong>, \
        for example, in advertisements, you may enter <em>UNKNOWN</em> or some description like '<em>Advertising announcer</em>'.\n The speakers for each statement have been automatically detected, and therefore may \
        not be completely accurate.\n You may enter the name of a single speaker twice if you believe <strong>a speaker has been incorrectly identified as two \
        different people</strong>.\n If you believe <strong>two different people have been identified as a single speaker</strong>, enter the name of the person \
        most often identified as this speaker number in the podcast."
    },
    FinalSubmission: {
        helpHeader: "Final submission after completion of all tasks.",
        helpText: "Complete each individual task card for the podcast statement to receive a green checkmark and \
        advance to the next statement. After all statements have a green check mark, and the minimum number of \
        fact checks queries and evidence are submitted, this button will be activated to finalize and return to Prolific."
    },
    Statement: {
        helpHeader: "Statement Card",
        helpText: "<p>Several audio player keyboard shortcuts are available: <br>\
        ↪<em>Enter</em> replays the current statement <br>\
        ↪<em>Shift+Enter</em> toggles audio play/pause <br>\
        ↪<em>Shift+PlusKey</em> increases audio speed <br>\
        ↪<em>Shift+MinusKey</em> decreases audio speed <br>\
        ↪<em>Shift+RightArrowKey</em> scrubs(skips) audio forward <br>\
        ↪<em>Shift+LeftArrowKey</em> scrubs audio backwards. <br>\
        </span></p>",
    },
}