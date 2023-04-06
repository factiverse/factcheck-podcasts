
export const checkworthyLabels = {
  instruction1: "Select the label that best describes the claim.",
  instruction2: "Press the corresponding key to select the label.",
  labels: [
    {keyStroke: "a", label: "Actions (past/present)", category: "Checkworthy", help: "Some action that has been done or is being done."},
    {keyStroke: "q", label: "Question (past/present)", category: "Checkworthy", help: "A question that has been asked or is being asked."},
    {keyStroke: "c", label: "Correlation/Causation", category: "Checkworthy", help: "A correlation or causation between two or more things."},
    {keyStroke: "l", label: "Laws or Rules", category: "Checkworthy", help: "A law or rule that is being followed or broken."},
    {keyStroke: "t", label: "Quotation", category: "Checkworthy", help: "A quotation from a source."},
    {keyStroke: "d", label: "Definition", category: "Checkworthy", help: "A definition of a word or phrase."},
    {keyStroke: "e", label: "Emotions", category: "Not Checkworthy", help: "An emotion that is being felt or expressed."},
    {keyStroke: "o", label: "Opinions and Values", category: "Not Checkworthy", help: "An opinion or value that is being expressed."},
    {keyStroke: "p", label: "Predictions", category: "Not Checkworthy", help: "A prediction of what will happen in the future."},
    {keyStroke: "u", label: "Public Opinion", category: "Not Checkworthy", help: "Public opinion about a topic."},
    {keyStroke: "g", label: "Greetings", category: "Not Checkworthy", help: "A greeting or salutation."},
  ]
};

export const advertisingLabels = {
  instruction1: "Identify Advertising",
  instruction2: "Choose whether this utterance is advertising, either inserted automatically into the audio, explicitly stated by presenters, or potential product placement.",
  labels: [
    {keyStroke: "a", label: "Not Advertising", category: "Not Advertising", help: "Regular audio content, no advertising."},
    {keyStroke: "q", label: "External Advertising", category: "Advertising", help: "Advertising that seems to have been externally inserted into the audio, usually at the beginning or end of the episode."},
    {keyStroke: "q", label: "Sponser Mentions", category: "Advertising", help: "Advertising that is explicitely read by presenters."},
  ]
};