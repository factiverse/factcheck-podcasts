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
  for including advertising, for example:\n \
  \
  <strong>External Advertising</strong> is the insertion (splicing in) of externally produced ads, often at the beginning \
  or end of the podcast, including foreign language that does not fit in the context of the podcast.\n \
  \
  <strong>Sponsor Mentions</strong> are podcast hosts pausing to read ads from commercial partners during the podcast, but being open about the \
  fact it is advertising. \n \
  \
  <strong>Self Promotion</strong> is a podcast host or guest mentioning a product or service they are known to sell personally, or which could be sold \
  by an organization they are affiliated with. \n \
  \
   <strong>Product Placement</strong> is podcast host mentioning a product or service during the podcast, but without clearly \
  stating that they are benefiting in some way from mentioning the product. \n \
  \
  <strong>Note :</strong> the podcast audio you are given in the media player was downloaded \
  outside of the US, so any <strong>unexpected foreign language</strong> is likely to be <strong>External Advertising</strong>.",
  key: "Advertising",
  expeditedValue: "Not Advertising",
  expeditedCategory: "Not Advertising",
  labels: [
    {
      keyStroke: "1",
      label: "Not Advertising",
      category: "Not Advertising",
      help: "Regular podcast audio content. No advertising.",
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
      help: "Advertising that is spoken by the hosts of this podcast, but they open about promoting some commercial partner."
    },
    {
      keyStroke: "4",
      label: "Self Promotion",
      category: "Advertising",
      help: "A speaker promoting products, services, or initiatives from themselves or an organization they are affiliated with."
    },
    {
      keyStroke: "5",
      label: "Product Placement",
      category: "Advertising",
      help: "I think it is possible the podcast creators will receive something in return for discussing a specific product or service \
       in this statement, and they have not been open about that."
    },
  ]
};

export const motivationLabels = {
  instruction1: "Why would you want to fact check this statement? What is there to gain?",
  instruction2: "Many statements could be placed in more than one category, pick the one that fits best in your opinion.",
  helpHeader: "Motivation Labels",
  helpText: " MOTIVATION HELP TEXT ",
  key: "Motivation",
  labels: [
    {
      keyStroke: "1",
      label: "Affirm",
      category: "Confirmation",
      help: "I believe this statement is true, and fact-checking would help confirm this to others.",
    },
    {
      keyStroke: "5",
      label: "Precision",
      category: "Confirmation",
      help: "I think the statement is generally true, but might be exaggerated or inaccurate."
    },
    {
      keyStroke: "2",
      label: "Refute",
      category: "Confirmation",
      help: "I believe this statement is false, whether or not it is intended to deceive."
    },
    {
      keyStroke: "4",
      label: "Deception",
      category: "Confirmation",
      help: "I think this statement may be partially true but is presented in a way meant to mislead."
    },
    {
      keyStroke: "3",
      label: "Discover",
      category: "Confirmation",
      help: "I don't know if the statement is correct; fact-checking would help me form an opinion."
    },
    {
      keyStroke: "6",
      label: "Public",
      category: "Integrity",
      help: "Affects the credibility of politicians, government officials, and agencies."
    },
    {
      keyStroke: "7",
      label: "Private",
      category: "Integrity",
      help: "Affects the credibility of a private person, company, or group."
    },
    {
      keyStroke: "8",
      label: "Academic",
      category: "Integrity",
      help: "Affects the credibility of academia, scientists, or researchers."
    },
    {
      keyStroke: "9",
      label: "Media",
      category: "Integrity",
      help: "Affects the credibility of media outlets, journalists, or content creators."
    },
    {
      keyStroke: "10",
      label: "Financial",
      category: "Impact",
      help: "This statement could have financial implications for individuals, companies, or governments. \
      or the speaker has a financial interest in the topic, for example advertising."
    },
    {
      keyStroke: "11",
      label: "Public Safety",
      category: "Impact",
      help: "I believe this statement could have implications for public security, health, or safety."
    },
    {
      keyStroke: "12",
      label: "Discrimination",
      category: "Impact",
      help: "I think this statement promotes discrimination or hate of people."
    },
  ]
};


