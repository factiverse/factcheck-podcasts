export const allQualifiers = ['Checkworthiness', 'Advertising', 'Motivation', 'Transcription', 'Factcheck', 'ClaimSpan', 'Diarization']; // 'Coreference'];

export const searchPlatforms = [{ name: "Google", key: "google" }, { name: "Bing", key: "bing" }, { name: "Yahoo", key: "yahoo" }, { name: "DuckDuckGo", key: "duckduckgo" }, { name: "Other (specify with query)", key: "other" }];

export const checkworthyLabels = {
  key: "Checkworthy", // string that can be used in HTML id attributes.
  instruction1: "Would it even be possible to fact check this statement using publicly available websites?",
  instruction2: "The checkworthy labels are used to describe statements that could feasibly be checked. \
  Non-checkworthy labels are labels that are used to describe claims that cannot be checked.",
  helpHeader: "Checkworthy Labels",
  helpText: "You can't really fact check what a random person had for lunch, but you could certainly fact \
  check what the King or President had for lunch with a foreign dignitary. Limited resources for fact checking \
  make this an important distinction, information about the average person's breakfast is neither of interest to \
  the public nor available to them, so trying to carry out a fact check would be senseless. To mark a statement \
  as checkworthy it must be something the public would be interested in and that could be checked with commonly available resources.",
  labels: [
    // CHECKWORTHY
    {
      keyStroke: "1",
      label: "Action or Occurrence",
      category: "Checkworthy",
      help: "Something that was done by a person, nature, force, entity, etc. and is part of the public record.",
      examples: [
        "The mayor declared a state of emergency after floodwaters inundated 3 neighborhoods.",
        "She won the London Marathon in 2019."
      ]
    },
    {
      keyStroke: "2",
      label: "Description or Existence",
      category: "Checkworthy",
      help: "Describing objective facts about a person, place, or thing that exists and which could be confirmed on the public internet.",
      examples: [
        "Michael Jackson was over 6 feet tall.",
        "There are no hospitals in the southern region."
      ]
    },
    {
      keyStroke: "3",
      label: "Cause and Effect",
      category: "Checkworthy",
      help: "Statements that one thing is caused by or associated with another thing, and where reputable public sources would exist.",
      examples: [
        "The collapse of the company was caused by a rouge employee embezzling funds.",
        "Smoking causes cancer."
      ]
    },
    {
      keyStroke: "4",
      label: "Laws, Rules, or Customs",
      category: "Checkworthy",
      help: "A law, rule, procedure, or custom that public sources would indicate is followed, broken, or investigated.",
      examples: [
        "The money laundering scheme violated both national and international law",
        "Italians drink beer with their pizza, not wine."
      ],
    },
    {
      keyStroke: "5",
      label: "Research or Statistics",
      category: "Checkworthy",
      help: "A specific statistic or academic finding that would be published by reputable sources.",
      examples: [
        "The latest poll shows that 80% of people are unhappy with the current government.",
        "The drug was found to improve the symptoms of 57% of patients."
      ]
    },
    {
      keyStroke: "6",
      label: "Quotation",
      category: "Checkworthy",
      help: "Repeating the words of another person or entity which can be verified in public sources.",
      examples: [
        "The spokesman was clear when he said, 'All flooded households will receive emergency assistance after a damage assessment.'",
        "President Roosevelt famously said, 'Ich bin ein Berliner.'"
      ]
    },
    {
      keyStroke: "7",
      label: "Definition",
      category: "Checkworthy",
      help: "A definition of a word or phrase which can be confirmed online with relevant and reputable sources.",
      examples: [
        "The government budget deficit is the total amount of money the government has borrowed over the years and currently owes to its creditors.", 
        "Photosynthesis is the process in which plants and some other organisms use sunlight to synthesize foods."
      ]
    },
    // NOT CHECKWORTHY
    {
      keyStroke: "8",
      label: "Emotions",
      category: "Not Checkworthy",
      help: "An emotion that is being felt or expressed.",
      examples: [
        "I love how the tulips look early on a spring morning.", 
        "I'm so angry about the way things are going."
      ]
    },
    {
      keyStroke: "9",
      label: "Opinions and Values",
      category: "Not Checkworthy",
      help: "An opinion, value, or advice that is being expressed without any checkable factual assertion.",
      examples: [
        "These politicians are the only ones who have half a clue.", 
        "Having a financial buffer is good for your well-being."
      ]
    },
    {
      keyStroke: "10",
      label: "Plans and Predictions",
      category: "Not Checkworthy",
      help: "A plan for the future or prediction of what will happen.",
      examples: [
        "Elon Musk will visit Mars.", "The sun will rise tomorrow."
      ]
    },
    {
      keyStroke: "11",
      label: "Public Opinion",
      category: "Not Checkworthy",
      help: "Public opinion about a topic not fully specified or formally investigated.",
      examples: [
        "They all think the government is corrupt.",
        "Everyone around here loves that restaurant."
      ]
    },
    {
      keyStroke: "12",
      label: "Personal Experience",
      category: "Not Checkworthy",
      help: "Claims a person makes about their own experience, but which cannot be verified in public sources.",
      examples: [
        "I passed four empty busses on my way to work yesterday.",
        "My grandmother used lard in her pie crusts."
      ]
    },
    {
      keyStroke: "13",
      label: "Not a Claim",
      category: "Not Checkworthy",
      help: "Not making any sort of claim.",
      examples: [
        "Hello, how are you?", 
        "Thanks for chatting with us today.", 
        "I'm sorry, I didn't know."
      ]
    },

  ]
};

export const advertisingLabels = {
  instruction1: "Is this advertising, or do you think it could be?",
  instruction2: "Advertising can be spliced into the audio, read aloud by the podcast hosts, or potential hidden product placement. Any unexpected <strong>foreign language</strong> is likely to be <em>External Advertising</em>.</strong>",
  helpHeader: "Advertising Labels",
  helpText: "Advertising is a common way for podcast creators to cover costs and support themselves. Podcasters have a wide range of options \
  for including advertising, for example:\n <strong>External Advertising</strong> is the insertion (splicing in) of externally produced ads, often at the beginning \
  or end of the podcast, including foreign language that does not fit in the context of the podcast.\n <strong>Sponsor Mentions</strong> are podcast presenters pausing to read ads from commercial partners during the podcast, but being open about the \
  fact it is advertising. \n <strong>Product Placement</strong> is where the podcast presenters mention a product or service during the podcast, but without clearly \
  stating that they are benefiting in some way from mentioning the product. \n <strong>Note :</strong> the podcast audio you are given in the media player was downloaded \
  outside of the US, so any <strong>unexpected foreign language</strong> is likely to be <strong>External Advertising</strong>.",
  key: "Advertising",
  labels: [
    {
      keyStroke: "1",
      label: "Not Advertising",
      category: "Not Advertising",
      help: "Regular podcast audio content, no advertising.",
      isKeyboardShortcut: true
    },
    {
      keyStroke: "2",
      label: "External Advertising",
      category: "Advertising",
      help: "Advertising that seems to be externally produced and inserted into the audio, usually at the beginning or end of the episode."
    },
    {
      keyStroke: "3",
      label: "Sponsor Mentions",
      category: "Advertising",
      help: "Advertising that is spoken by the hosts of this podcast, but they are not trying to hide that they are promoting some commercial partner."
    },
    {
      keyStroke: "4",
      label: "Obviously",
      category: "Product Placement",
      help: "A specific product or service is being discussed, and it seems likely the podcast hosts will benefit without being open about it to listeners."
    },
    {
      keyStroke: "5",
      label: "Could Be",
      category: "Product Placement",
      help: "A specific product or service is being discussed, and I think it could potentially be unannounced product placement."
    },
    {
      keyStroke: "6",
      label: "Doubtful",
      category: "Product Placement",
      help: "I doubt this is product placement, but I don't think it's impossible. \
      (select \"Not Advertising\" if you think product placement is impossible)"
    },
  ]
};

export const motivationLabels = {
  instruction1: "Why would a person make this statement? What might they hope to gain from it?",
  instruction2: "Many statements could be placed in more than one category but pick the one that you think fits best.",
  helpHeader: "Motivation Labels",
  helpText: "People usually speak for a reason, whether their goal is to inform, persuade, instruct, sympathize, comfort, or come across as pleasant.",
  key: "Motivation",
  labels: [
    {
      keyStroke: "1",
      label: "Inform",
      category: "Motivation",
      help: "Providing new factual information to the listener.",
    },
    {
      keyStroke: "2",
      label: "Persuade",
      category: "Motivation",
      help: "Attempting to convince the listener that one point of view is superior to another."
    },
    {
      keyStroke: "3",
      label: "Entertain",
      category: "Motivation",
      help: "Being humorous or storytelling with the intent to amuse the listener."
    },
    {
      keyStroke: "4",
      label: "Instruct",
      category: "Motivation",
      help: "Giving directions on how to complete a task or encouraging listeners to carry out a task."
    },
    {
      keyStroke: "5",
      label: "Seek Information",
      category: "Motivation",
      help: "Asking for repetition, more information, or discussing how and where it might be found."
    },
    {
      keyStroke: "6",
      label: "Express Emotion",
      category: "Motivation",
      help: "Expressing an emotion, such as sympathy, anger, satisfaction, or joy."
    },
    {
      keyStroke: "7",
      label: "Assert Identity",
      category: "Motivation",
      help: "Defining themselves or their group by expressing their values, beliefs, or opinions."
    },
    {
      keyStroke: "8",
      label: "Social Approval",
      category: "Motivation",
      help: "Exchanging pleasantries, seeking validation, avoiding awkward silence, or building relationships."
    },
  ]
};


