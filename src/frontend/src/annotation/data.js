
export const checkworthyLabels = {
  instruction1: "Select the label that best describes the claim.",
  instruction2: "Press the corresponding key to select the label.",
  helpHeader: "Checkworthy Labels",
  helpText: "Checkworthy labels are labels that are used to describe claims that can be checked. Non-checkworthy labels are labels that are used to describe claims that cannot be checked.",
  key: "checkworthy", // string that can be used in HTML id attributes
  labels: [
    {keyStroke: "1", label: "Actions (past/present)", category: "Checkworthy", help: "Some action that has been done or is being done."},
    {keyStroke: "2", label: "Question (past/present)", category: "Checkworthy", help: "A question that has been asked or is being asked."},
    {keyStroke: "3", label: "Correlation/Causation", category: "Checkworthy", help: "A correlation or causation between two or more things."},
    {keyStroke: "4", label: "Laws or Rules", category: "Checkworthy", help: "A law or rule that is being followed or broken."},
    {keyStroke: "5", label: "Quotation", category: "Checkworthy", help: "A quotation from a source."},
    {keyStroke: "6", label: "Definition", category: "Checkworthy", help: "A definition of a word or phrase."},
    {keyStroke: "7", label: "Emotions", category: "Not Checkworthy", help: "An emotion that is being felt or expressed."},
    {keyStroke: "8", label: "Opinions and Values", category: "Not Checkworthy", help: "An opinion or value that is being expressed."},
    {keyStroke: "9", label: "Predictions", category: "Not Checkworthy", help: "A prediction of what will happen in the future."},
    {keyStroke: "a", label: "Public Opinion", category: "Not Checkworthy", help: "Public opinion about a topic."},
    {keyStroke: "b", label: "Greetings", category: "Not Checkworthy", help: "A greeting or salutation."},
  ]
};

export const advertisingLabels = {
  instruction1: "Select one choice about advertising",
  instruction2: "Advertising can be spliced into the audio, read aloud by the podcast hosts, or potential hidden product placement.",
  helpHeader: "Advertising Labels",
  helpText: "Advertising labels are labels that are used to describe advertising that is present in the audio.",
  key: "advertising",
  labels: [
    {keyStroke: "1", label: "Not Advertising", category: "Not Advertising", help: "Regular audio content, no advertising."},
    {keyStroke: "2", label: "External Advertising", category: "Advertising", help: "Advertising that seems to have been externally inserted into the audio, usually at the beginning or end of the episode."},
    {keyStroke: "3", label: "Sponser Mentions", category: "Advertising", help: "Advertising that is explicitely read by presenters."},
    {keyStroke: "3", label: "Obviously", category: "Product Placement", help: "Advertising that is explicitely read by presenters."},
    {keyStroke: "3", label: "Could Be", category: "Product Placement", help: "Advertising that is explicitely read by presenters."},
    {keyStroke: "3", label: "Possibly", category: "Product Placement", help: "Advertising that is explicitely read by presenters."},
  ]
};

export const searchPlatforms = [{name: "Google", key: "google"}, {name: "Bing", key: "bing"}, {name: "DuckDuckGo", key: "duckduckgo" }]