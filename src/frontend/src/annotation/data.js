export const utteranceList = [{
  seq: 1,
  podcast: "Verdict with Ted Cruz",
  episode: "Border Madness & Gun Ignorance",
  utterance: {text: "Before he arrived in El Paso, there had been illegal immigrants sleeping on the streets.", speaker: "Ted Cruz", start: "00:01:48", end: "00:01:52"},
  context: 
  [{text: "The bad news is everything he's done is bad.", speaker:"Ted Cruz",	start: "00:01:39", end:	"00:01:42"},
  {text: "He flew down to the southern border.", speaker:"Ted Cruz",	start: "00:01:42", end:	"00:01:44"},
  {text: "He went to El Paso, not the Rio Grande Valley, which is the epicenter of the disaster.", speaker:"Ted Cruz",	start: "00:01:44", end:	"00:01:48"}],
},
{
  seq: 2,
  podcast: "Verdict with Ted Cruz",
  episode: "Border Madness & Gun Ignorance",
  utterance: {text: "5.3 million people have crossed illegal under Joe Biden.", speaker: "Ted Cruz", start: "00:06:41", end: "00:06:45"},
  context: 
  [{text: "I don't think that that acronym is is accidental.",	speaker:"Ted Cruz",	start: "00:06:29",	end:	"00:06:33"},
  {text: "So we are right now facing the worst crisis of illegal immigration in the history of our country.",	speaker: "Ted Cruz",	start: "00:06:33", end:"00:06:39"},
  {text: "It has never been this bad.",	speaker:"Ted Cruz",	start: "00:06:39",	end:	"00:06:41"}]
}];

export const checkworthyLabels = [
  {keyStroke: "a", label: "Actions (past/present)", checkworthy: 1},
  {keyStroke: "q", label: "Question (past/present)", checkworthy: 1},
  {keyStroke: "c", label: "Correlation/Causation", checkworthy: 1},
  {keyStroke: "l", label: "Laws or Rules", checkworthy: 1},
  {keyStroke: "t", label: "Quotation", checkworthy: 1},
  {keyStroke: "d", label: "Definition", checkworthy: 1},
  {keyStroke: "e", label: "Emotions", checkworthy: 0},
  {keyStroke: "o", label: "Opinions and Values", checkworthy: 0},
  {keyStroke: "p", label: "Predictions", checkworthy: 0},
  {keyStroke: "u", label: "Public Opinion", checkworthy: 0},
  {keyStroke: "g", label: "Greetings", checkworthy: 0},
];
