export const checkworthyLabels = {
  instruction1: "Would it even be possible to fact check this statement using publicly available websites?",
  instruction2: "The checkworthy labels are used to describe statements that could feasibly be checked. Non-checkworthy labels are labels that are used to describe claims that cannot be checked.",
  helpHeader: "Checkworthy Labels",
  helpText: "You can't really fact check what a random person had for lunch, but you could certainly fact check what the King or President had for lunch with a foreign dignitary. Limited resources for fact checking make this an important distinction, information about the average person's breakfast is neither of interest to the public nor available to them, so trying to carry out a fact check would be senseless. To mark a statement as checkworthy it must be something the public would be interested in and that could be checked with commonly available resources.",
  key: "checkworthy", // string that can be used in HTML id attributes
  labels: [
    {keyStroke: "1", label: "Actions (past/present)", category: "Checkworthy", help: "Something that was done by a person, nature, force, entity, etc. For example, \"The mayor declared a state of emergency after floodwaters inundated 3 neighborhoods.\""},
    {keyStroke: "2", label: "Question (past/present)", category: "Checkworthy", help: "A question that contains a factual assertion. For example, \"Don't you think they should do something about the drop in average household purchasing power?\""},
    {keyStroke: "3", label: "Correlation/Causation", category: "Checkworthy", help: "Statements that one thing is caused by or associated with another thing. For example, \"The collapse of the company was caused by a rouge accounts payable employee embezzling funds.\""},
    {keyStroke: "4", label: "Laws or Rules", category: "Checkworthy", help: "A law, rule, procedure, or custom that that been followed, broken, or claimed. For example, \"The money laundering scheme violated national and international law, and employees of at least two banks were found to have violated internal regulations.\""},
    {keyStroke: "5", label: "Research or Statistics", category: "Checkworthy", help: "A research finding or statistic that has been published or claimed. For example, \"The latest poll shows that 80% of people are unhappy with the Prime Minister.\""},
    {keyStroke: "5", label: "Quotation", category: "Checkworthy", help: "Repeating the words of another person or entity. For example, \"The mayor was clear when he said, 'All flooded households will receive emergency assistance after a damage assessment.'\""},
    {keyStroke: "6", label: "Definition", category: "Checkworthy", help: "A definition of a word or phrase. For example, \"The government budget deficit is the total amount of money the government has borrowed over the years and currently owes to its creditors.\""},
    {keyStroke: "7", label: "Emotions", category: "Not Checkworthy", help: "An emotion that is being felt or expressed. For example, \"I love how the tulips look early on a spring morning.\""},
    {keyStroke: "8", label: "Opinions and Values", category: "Not Checkworthy", help: "An opinion or value that is being expressed without any factual assertion. For example, \"I vote for that political party because they are the only ones who have half a clue.\""},
    {keyStroke: "9", label: "Predictions", category: "Not Checkworthy", help: "A speculative prediction of what will happen in the future. For example, \"Elon Musk will visit Mars. The sun will rise tomorrow. NOT \"I bet he'll get sick if he eats that hogweed.\""},
    {keyStroke: "a", label: "Public Opinion", category: "Not Checkworthy", help: "Public opinion about a topic not formally investigated. For example, \"Everyone knows the government is corrupt, nobody thinks the politicians are in it for anybody but themselves.\""},
    {keyStroke: "b", label: "Greetings", category: "Not Checkworthy", help: "A greeting or salutation. For example, \"Hello, how are you? Thanks for chatting with us today.  \""},
  ]
};

export const advertisingLabels = {
  instruction1: "Is this advertising, or do you think it might be?",
  instruction2: "Advertising can be spliced into the audio, read aloud by the podcast hosts, or potential hidden product placement.",
  helpHeader: "Advertising Labels",
  helpText: "Advertising is a common way for podcast creators to support themselves. In contrast to traditional radio or television broadcasts, podcasters have a wider range of options from the familiar splicing in of externally produced ads, to explicitly reading ads as part of podcast content, or as.",
  key: "advertising",
  labels: [
    {keyStroke: "1", label: "Not Advertising", category: "Not Advertising", help: "Regular podcast audio content, no advertising."},
    {keyStroke: "2", label: "External Advertising", category: "Advertising", help: "Advertising that seems to have been externally inserted into the audio, usually at the beginning or end of the episode."},
    {keyStroke: "3", label: "Sponsor Mentions", category: "Advertising", help: "Advertising that is read by presenters but clearly identified as advertising for a commercial partner."},
    {keyStroke: "4", label: "Obviously", category: "Product Placement", help: "I think this statement contains obvious product placement."},
    {keyStroke: "5", label: "Could Be", category: "Product Placement", help: "It's possible this statement could contain product placement, but I'm not entirely sure."},
    {keyStroke: "6", label: "Doubtful", category: "Product Placement", help: "There is no reason to think this statement contains product placement, but it's not entirely impossible. (select \"Not Advertising\" if product placement is impossible)"},
  ]
};

export const motivationLabels = {
  instruction1: "Why would a person make this statement? What might they hope to gain from it?",
  instruction2: "Many statements could be placed in more than one category but pick the one that you think fits best.",
  helpHeader: "Motivation Labels",
  helpText: "People usually speak for a reason, whether their goal is to inform, persuade, instruct, sympathize, comfort, or come across as pleasant.",
  key: "motivation",
  labels: [
    {keyStroke: "1", label: "Inform", category: "Motivation", help: "Providing new factual information to the listener."},
    {keyStroke: "2", label: "Persuade", category: "Motivation", help: "Attempting to convince the listener that something is better or worse than something else."},
    {keyStroke: "3", label: "Entertain", category: "Motivation", help: "Being humorous or storytelling with the intent to amuse the listener."},
    {keyStroke: "4", label: "Instruct", category: "Motivation", help: "Giving directions how to complete a task or encouraging listeners to carry out a task."},
    {keyStroke: "5", label: "Seek Information", category: "Motivation", help: "Asking for repetition, more information, or discussing how and where it might be found."},
    {keyStroke: "6", label: "Express Emotion", category: "Motivation", help: "Expressing an emotion, such as sympathy, anger, satisfaction, or joy."},
    {keyStroke: "7", label: "Assert Identity", category: "Motivation", help: "Defining themselves or their group by expressing their values, beliefs, or opinions."},
    {keyStroke: "8", label: "Social Approval", category: "Motivation", help: "Exchanging pleasantries, seeking validation, avoiding awkward silence, or building relationships."},
  ]
};

export const searchPlatforms = [{name: "Google", key: "google"}, {name: "Bing", key: "bing"}, {name: "DuckDuckGo", key: "duckduckgo" }]
